import request from '@/utils/request';
import type { LoginForm ,responseSource} from './type';

export const userLogin = (form:LoginForm):ResponsePromise<responseSource> =>{
    return request({
        url: '/auth/login',
        method: 'POST',
        data:form
    });
}