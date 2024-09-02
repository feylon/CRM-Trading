import { checkToken } from "../../../functions/jwtadmin.js";
import { Router } from "express";
let router = Router();


router.post("/", checkToken, async (req, res, next)=>{
    req.adminId = null;
    req.IsAdmin = false;
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).send('Error logging out');
        }
    
        res.status(200).send('Logged out successfully');
      });
    
});


export default router;