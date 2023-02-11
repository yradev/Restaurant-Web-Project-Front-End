import { get, post } from "./Connection";
import { setLoginDetails } from "./Storage";

export async function getRoles(){
  const userData = await get("/user");
    return userData.roles.map(a=>Object.values(a)[0].substring(5));
}

export async function login(email,password){
    try {
        const token = await post("/auth/login", { email, password });
        setLoginDetails(token, email);        
      } catch (error) {
        return error.message;
      }
}

