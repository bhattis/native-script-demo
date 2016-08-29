const validator = require("email-validator");

// @Injectable()
export class User {
  
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: string;
  
  isValidEmail() {
    return validator.validate(this.email);
  }

  fullname() {
    return `#{this.first_name} #{this.last_name}`
  }
}