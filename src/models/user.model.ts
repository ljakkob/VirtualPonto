export class User {  password: any;


    constructor(
        public name: string,
        public username: string,
        public email: string,
        public uid: string,
        public horaEntrada: number,
        public minEntrada: number,
        public horaSaidaAlmoco: number,
        public minSaidaAlmoco: number,
        public horaRetornoAlmoco: number,
        public minRetornoAlmoco: number,
        public horaSaida: number,
        public minSaida: number   

    ){}
}