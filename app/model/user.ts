const validator = require("email-validator");

export class User {
  
  name: string;
  email: string;
  password: string;
  userToken: string;
  objectId: string;

  constructor() { }
  
  isValidEmail() {
    return validator.validate(this.email);
  }

}