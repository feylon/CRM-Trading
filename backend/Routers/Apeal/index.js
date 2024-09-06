import getapeal from "./get.js"
import edit from "./update.js"
import comment from "./comment.js"

export default [
    { path: "/getapeal", route: getapeal },
    { path : "/edit", route : edit},
    { path : "/comment", route : comment}
]
