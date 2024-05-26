interface ErrorsDictionary {
    [key: string]: string;
  }
  
  export const errorsDictionary: ErrorsDictionary = {
    required: 'El campo es obligatorio.',
    email: 'Debe ser un email válido.',
    // minlength: 'Debe contener mínimo 8 caracteres.',
    passwordsMustBeEqual: 'Las contraseñas no coinciden.',
    checkUsernameIsAvailable: 'El nombre de usuario no está disponible.',
    checkValidOldPasword: 'Contraseña incorrecta.',
    invalidCredentials: 'Las credenciales proporcionadas son incorrectas.',
    emptyRecipeDontPublish: 'La receta no puede estar vacía. Debe tener al menos un paso y un ingrediente.',
  };