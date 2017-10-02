import { UserModel } from './../../models/userModel';
import _ from 'lodash';
import { MONTHS_KEYS, FINISHED, RETURN_INTERVAL, INTERVAL, END, START, NEUTRAL, POSITIVE, NEGATIVE } from './../../models/employer-time-track';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class RegisterProvider {


  constructor(public localStorageDb: Storage) {
  }

  // Serviços do provider Register
  registerPoint = (datePoint: Date, userLogged: UserModel): Promise<any> => {
    return new Promise((resolve, reject) => {

      // obtendo a key que é o mes da data enviada
      const key = MONTHS_KEYS[datePoint.getMonth()];
      // obtendo subkey que é o login do usuario
      const subKey = userLogged.login.toString();

      let registers = [];
      let fetchedPoint = null;

      // tentando encontrar um registro q tem como key o mes atual
      this.load(key).then(users => {

        if (users) {
          // se o mes atual possuir registros entao...
          // pega os pontos referente ao usuario..
          let userPoints = users[subKey];

          // pesquisa na lista se ja existe um ponto inicializao hoje..
          fetchedPoint = this.searchForExistentPoint(userPoints, datePoint);

          // se encontrar um ponto já inicializado...
          if (fetchedPoint) {

            // verifica se o status é finished, se for pare por aqui e volta pro menu
            if (fetchedPoint.status === FINISHED) {

              this.calculateOvertime(fetchedPoint, userLogged);
              reject(false);
              return;
            }

            // se chegar aqui então.. atualiza o ponto encontrado com a data/hora enviado.
            fetchedPoint = this.updateRegisterPoint(fetchedPoint, datePoint, userLogged);

            // percorre a lista de pontos do usuario para inserir o ponto atualizado
            // (procurar uma forma melhor... check a lib lodash..)
            _.forEach(userPoints, (point) => {
              if (point.datePointString === fetchedPoint.datePointString) {
                point = fetchedPoint;
              }
            });

            // atualiza os pontos do usuario após atualizar o ponto encontrado..
            users[subKey] = userPoints;

          } else {

            if (!userPoints) userPoints = [];

            fetchedPoint = this.builderRegisterPoint(datePoint, userLogged);

            userPoints.push(fetchedPoint);
            users[subKey] = userPoints;

          }

        }
        // se o mes ainda não possuir nenhuma entrada de dados.. entao..
        else {

          // cria o ponto para inserir na nova lista....
          fetchedPoint = this.builderRegisterPoint(datePoint, userLogged);

          // inicializa uma lista para inserir o ponto criado
          registers = [];
          // insere o ponto criado...
          registers.push(fetchedPoint);

          // inicializa um objeto de usuario para o mês vigente...
          users = {};

          // adiciona uma nova chave com o login do usuario e adiciona como valor
          // a lista de pontos criada.
          users[subKey] = registers;
        }

        // salva a referencia completa no storage..
        this.save(key, users)
        // retorna o ponto criado para atualizar dados da tela de menu...
        resolve({ register: fetchedPoint });
      });

    });
  }

  getRegisterFromDatebaseTime = (key: string, subKey: string): Promise<any> => {

    return this.load(key).then(users => {
      if (users) {
        const userPoints = users[subKey];

        const positivePoints = _.filter(userPoints, (point) => point.hasOverTime === POSITIVE);
        const negativePoints = _.filter(userPoints, (point) => point.hasOverTime === NEGATIVE);

        return {
          positivePoints,
          negativePoints,
          sumPositives: _.sum(_.map(positivePoints, (point) => point.overTime)),
          sumNegatives: _.sum(_.map(negativePoints, (point) => point.overTime))
        };

      }

      return {
        positivePoints: [],
        negativePoints: [],
        sumPositives: [],
        sumNegatives: []
      }
      
    });

  }

  getMonthRegisterOfUser = (key: string, subKey: string): Promise<any> => {
    return this.load(key).then(users => {

      if (users) {
        return _.orderBy(users[subKey], ['referenceDate'], ['asc']);
      }

      return [];

    })
  }

  // metodos util para ser usado dentro do provider
  private save = (key, value): void => {
    this.localStorageDb.set(key, value);
  }

  private load = (key): Promise<any> => {
    return this.localStorageDb.get(key);
  }

  private searchForExistentPoint = (registers: Array<any>, datePoint: Date): any => {
    return _.find(registers,
      (point) => point.datePointString === datePoint.toLocaleDateString()
    );
  }

  private builderRegisterPoint = (datePoint: Date, userLogged: UserModel) => {
    let datePointString = datePoint.toLocaleDateString();

    const register = {
      registerId: `${datePointString}-${userLogged.login}`,
      userId: userLogged.id,
      datePointString: datePointString,
      referenceDate: datePoint,
      startTime: datePoint,
      endTime: null,
      intervalTime: null,
      returnTime: null,
      status: START,
      nextStatus: INTERVAL,
      overTime: 0
    }

    return register;
  }

  private updateRegisterPoint = (register: any, datePoint: Date, user: UserModel): any => {

    switch (register.nextStatus) {
      // de acordo com o status que estiver ele seta o proximo ponto da vez
      // e avança o status...
      case INTERVAL:
        register.referenceDate = datePoint; // atualizar a data/hora de referencia
        register.intervalTime = datePoint;
        register.status = INTERVAL;
        register.nextStatus = RETURN_INTERVAL;
        break;

      case RETURN_INTERVAL:
        register.referenceDate = datePoint; // atualizar a data/hora de referencia
        register.returnTime = datePoint;
        register.status = RETURN_INTERVAL;
        register.nextStatus = END;
        break;

      case END:
        register.referenceDate = datePoint; // atualizar a data/hora de referencia
        register.endTime = datePoint;
        register.status = END;
        register.nextStatus = FINISHED;

        register = this.calculateOvertime(register, user);
        break;

      default:
        // nada a se fazer aqui..
        break;
    }

    return register;
  }

  private calculateOvertime(register: any, user: UserModel): any {

    const { allMinute } = user.settings.workDayTime;
    const { startTime, intervalTime, returnTime, endTime } = register;

    const timeWorkedInMillisecond = (
      (endTime.getTime() - startTime.getTime()) - (returnTime.getTime() - intervalTime.getTime())
    );

    const timeWorkedInMinute = parseInt((timeWorkedInMillisecond / 1000 / 60).toFixed(0));
    const overTime = timeWorkedInMinute - allMinute;

    if (overTime > 0) {
      register.hasOverTime = POSITIVE;
      register.overTime = overTime;

    } else if (overTime < 0) {
      register.hasOverTime = NEGATIVE;
      register.overTime = (overTime * -1);

    } else {
      register.hasOverTime = NEUTRAL;
    }

    return register;
  }
}


