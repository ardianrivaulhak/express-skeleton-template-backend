import axios from 'axios';
import configs from '../configs/index.js';

class UserService {
  #api;
  constructor(Authorization = null) {
    this.#api = axios.create({
      baseURL: `${configs.service.apiGatewayUrl}u/`,
      headers: {
        Authorization,
      },
    });
  }

  async partnerById(partnerId) {
    try {
      const { data } = await this.#api.get(`partners/${partnerId}`);
      return data.data;
    } catch (e) {
      console.error('failed partner by id => ', e.response?.data || e);
    }
  }

  async memberByUserId(userId) {
    console.log('Get member by user id =>', userId);
    try {
      const { data } = await this.#api.get(`users/${userId}/member`);
      console.log(data.data);
      return data.data;
    } catch (e) {
      console.error('failed member by id => ', e.response?.data || e);
      return null;
    }
  }

  async partnerByUserId(userId) {
    console.log('Get partner by user id =>', userId);
    try {
      const { data } = await this.#api.get(`users/${userId}/partner`);
      return data.data;
    } catch (e) {
      return null;
      console.error('failed partner by id => ', e.response?.data || e);
    }
  }

  async updateFcm(userId, fcmToken) {
    try {
      const { data } = await this.#api.put('update-fcm', {
        user_id: userId,
        fcm_token: fcmToken,
      });
      return data;
    } catch (e) {
      console.error('Failed to update FCM');
    }
  }
}

export default new UserService();
