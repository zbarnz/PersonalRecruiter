const apiBaseUrl = {
  dev: 'https://localhost:4000/api',
  prod: 'https://www.personalrecruiter.com/autoapply/api'
}[process.env.NODE_ENV || 'development']; 

export { apiBaseUrl };
