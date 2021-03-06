import Mvc from 'crizmas-mvc';
import Form, {validation} from 'crizmas-form';

import router from 'js/router';
import {currentUser} from 'js/models/user';
import userController, {usernameValidator, passwordValidator} from 'js/controllers/user';

export default Mvc.controller(function RegisterController() {
  const ctrl = {
    userController,
    form: null,
    serverErrors: null
  };

  ctrl.onEnter = () => {
    if (currentUser.isAuthenticated) {
      router.transitionTo('/');

      return false;
    }

    init();
  };

  const init = () => {
    ctrl.form = new Form({
      children: [
        {
          name: 'username',
          validate: validation(validation.required(), usernameValidator)
        },
        {
          name: 'email',
          validate: validation.required()
        },
        {
          name: 'password',
          validate: validation(validation.required(), passwordValidator)
        }
      ],

      actions: {
        submit: () => {
          ctrl.register(ctrl.form.getResult());
        }
      },

      onFormChange: () => {
        ctrl.serverErrors = null;
      }
    });
  };

  ctrl.register = ({username, email, password}) => {
    ctrl.serverErrors = null;

    return userController.register({username, email, password}).then(
      () => {
        router.transitionTo('/');
      },

      (serverErrors) => {
        ctrl.serverErrors = serverErrors;
      }
    );
  };

  return ctrl;
});
