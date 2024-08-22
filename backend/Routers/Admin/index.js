//  Auth admin

import login from "./Auth/login.js";
import changepassword from "./Profil/changepassword.js"
import changePhoto from "./Profil/changePhoto.js"
import getprofile from "./Profil/getprofil.js"
import changeProfil from "./Profil/changeProfil.js"

export default [
  { path: "/login", route: login },
  {path: "/changepassword", route : changepassword},
  {path: "/changePhoto", route : changePhoto},
  {path : "/getprofile", route : getprofile},
  {path : "/changeProfil", route : changeProfil}
];
