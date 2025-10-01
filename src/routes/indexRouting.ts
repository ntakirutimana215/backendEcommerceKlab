import productRouter  from "./productPath";
import categoryRoutes from "./categoryPath"
import cartRoutes from "./cartRoutes"
import { Router } from "express";
import userrRoutes from "./userrRoutes";

const mainRouter = Router();

mainRouter.use('/product',productRouter)
mainRouter.use("/categories",categoryRoutes )
mainRouter.use("/cart",cartRoutes)
mainRouter.use("/user", userrRoutes);


export default mainRouter;