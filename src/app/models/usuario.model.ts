import { environment } from "src/environments/environment.development"

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public nombre    : string,
        public email     : string,
        public password? : string,
        public uuid?     : string,
        public role?     : 'ADMIN_ROLE' | 'USER_ROLE',
        public img?      : string,
        public google?   : boolean
    ){

    }

    get imagenUrl() {

        if(!this.img){
            return `${base_url}/upload/usuarios/no-image`;
        }else if(this.img?.includes('https')){
            return this.img;
        }else if(this.img){
            return `${base_url}/upload/usuarios/${this.img}`;
        }else{
            return `${base_url}/upload/usuarios/no-image`;
        }
    }
}