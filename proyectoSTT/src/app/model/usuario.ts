export class Usuario {

  constructor(
    public id_usuario:number,
    public tipo_usuario:string,
    public e_mail: string,
    public pass: string,
    public nombre: string,
    public apellido: string,
    public genero: string,
    public cargo: string,
    public telefono: string,
    public entidad: string,
    public imagen: any,
    public imagenName: string,
    public usuario_superior:number
  ) {  } 
}