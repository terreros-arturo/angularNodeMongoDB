export class User{
    
    constructor(
        /*se declara el atributo de clase _id y se asigna en el constructor al recibirlo como parametro,
        hacerlo de otra manera sería algo similar a esto
        export class User{
            public _id: string
            ...
            constructor(
                _id: string,
                ...
            ){
                this._id = id;
                ...
            }
        }
        */
        public _id: string,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string,
        public gethash: boolean
    ){}

}