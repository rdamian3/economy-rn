export function userResponse(response) {
  switch (response.status) {
    case 200:
    case 201:
      return 'Bienvenido ' + response.data.user.displayName;
    case 403:
      return 'Usuario o contraseña incorrectos';
    case 500:
      return 'Usuario duplicado';
    default:
      return '---';
  }
}
