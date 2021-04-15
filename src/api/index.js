import request from '@/utils/request';

function get(uri, parameter) {
  return request({
    url: uri,
    method: 'get',
    params: parameter,
  });
}
function post(uri, parameter) {
  return request({
    url: uri,
    method: 'post',
    data: parameter,
  });
}

function getList(parameter) {
  return get('/realtime-api/member', parameter);
}
function setList(parameter) {
  return post('/realtime-api/member', parameter);
}
export {
  getList,
  setList,
};
