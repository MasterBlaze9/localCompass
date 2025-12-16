const BASE_URL = process.env.BASE_URL


const postService = {

   async getAllPosts() {
       const response = await fetch(BASE_URL + "/posts");
       const data = await response.json();
       console.log(data)
       return data;
   }
}


export default postService;

