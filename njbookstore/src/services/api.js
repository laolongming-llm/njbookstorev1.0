import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000
});

// 获取所有心愿
export const getWishes = async () => {
  try {
    const response = await api.get('/wishes');
    return response.data;
  } catch (error) {
    console.error('获取心愿失败:', error);
    throw error;
  }
};

// 创建心愿
export const createWish = async (wish) => {
  try {
    const response = await api.post('/wishes', wish);
    return response.data;
  } catch (error) {
    console.error('创建心愿失败:', error);
    throw error;
  }
};

// 删除心愿
export const deleteWish = async (id) => {
  try {
    const response = await api.delete(`/wishes/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除心愿失败:', error);
    throw error;
  }
};
