import axios from 'axios';

export const getPost = async (id: number) => {
  const time = new Promise((res, rej) => {
    setTimeout(() => {
      res('hi');
    }, 2000);
  });
  const my = await time;
  if (my === 'hi') {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }
};
export const getUsers = () =>
  axios.get('https://jsonplaceholder.typicode.com/users');
