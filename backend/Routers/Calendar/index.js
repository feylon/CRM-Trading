import getcalendar from "./get.js"
import add from "./add.js"
import deletecalendar from './delete.js'

export default [
  { path: "/getcalendar", route: getcalendar },
  { path : "/addcalendar", route : add},
  { path : "/delete", route : deletecalendar}
];
