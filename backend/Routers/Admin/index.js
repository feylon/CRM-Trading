//  Auth dean

import login from "./Auth/login.js";
import changepassword from "./Profil/changepassword.js"

export default [
  { path: "/login", route: login },
  {path: "/changepassword", route : changepassword}
];
