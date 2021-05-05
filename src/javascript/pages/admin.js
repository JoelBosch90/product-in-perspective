/**
 *  Main file for the augmented reality admin interface. This is the master file
 *  that arranges routing for the login and the different form pages.
 */

// Import dependencies.
import { Form } from "/javascript/widgets/Form.js";

/**
 *  This is the container for the entire application. Because we want to use the
 *  full page, we can simply use the document's body element.
 *  @var      {Element}
 */
const container = document.body;

// Create a login form.
const loginForm = new Form(container, {
  title: "Login",
  inputs: [
    {
      name:   "email",
      options: {
        label:  "Email address",
        type:   "email",
      },
    },
    {
      name:   "password",
      options: {
        label:  "Password",
        type:   "password",
      },
    },
  ],
  buttons: [
    {
      name:   "submit",
      options: {
        label:  "Login",
        type:   "submit",
      },
    },
  ],
});

// Create a registration form.
const registrationForm = new Form(container, {
  title: "Registration",
  inputs: [
    {
      name:   "email",
      options: {
        label:  "Email address",
        type:   "email",
      },
    },
    {
      name:   "password",
      options: {
        label:  "Password",
        type:   "password",
      },
    },
    {
      name:   "repeat",
      options: {
        label:  "Repeat password",
        type:   "password",
      },
    },
  ],
  buttons: [
    {
      name:   "submit",
      options: {
        label:  "Register",
        type:   "submit",
      },
    },
  ],
});

// Create a change password.
const changePasswordForm = new Form(container, {
  title: "Change password",
  inputs: [
    {
      name:   "password",
      options: {
        label:  "Password",
        type:   "password",
      },
    },
    {
      name:   "repeat",
      options: {
        label:  "Repeat password",
        type:   "password",
      },
    },
  ],
  buttons: [
    {
      name:   "submit",
      options: {
        label:  "Change",
        type:   "submit",
      },
    },
  ],
});

// Create a form for creating an app.
const createApp = new Form(container, {
  title: "App creation",
  inputs: [
    {
      name:   "name",
      options: {
        label:  "Name",
        type:   "text",
      },
    },
    {
      name:   "slug",
      options: {
        label:  "Slug",
        type:   "text",
      },
    },
  ],
  fieldsets: [
    {
      name:   "scanning",
      options: {
        legend: "Texts in scanning mode",
        inputs: [
          {
            name:   "title",
            options: {
              label:  "Title",
              type:   "text",
            }
          },
          {
            name:   "description",
            options: {
              label:  "Description",
              type:   "textarea",
            }
          },
          {
            name:   "button",
            options: {
              label:  "Button",
              type:   "text",
            }
          },
        ],
      },
    },
    {
      name:   "placing",
      options: {
        legend: "Texts in placing mode",
        inputs: [
          {
            name:   "title",
            options: {
              label:  "Title",
              type:   "text",
            },
          },
          {
            name:   "description",
            options: {
              label:  "Description",
              type:   "textarea",
            },
          },
          {
            name:   "button",
            options: {
              label:  "Button",
              type:   "text",
            },
          },
        ],
      },
    },
    {
      name:   "viewing",
      options: {
        legend: "Texts in viewing mode",
        inputs: [
          {
            name:   "title",
            options: {
              label:  "Title",
              type:   "text",
            },
          },
          {
            name:   "description",
            options: {
              label:  "Description",
              type:   "textarea",
            },
          },
          {
            name:   "button",
            options: {
              label:  "Button",
              type:   "text",
            },
          },
        ],
      },
    },
  ],
  buttons: [
    {
      name:   "submit",
      options: {
        label:  "Create app",
        type:   "submit",
      },
    },
  ],
});

// Create a form for creating an new model.
const createModel = new Form(container, {
  title: "Model creation",
  inputs: [
    {
      name:   "name",
      options:  {
        label:  "Name",
        type:   "text",
      },
    },
    {
      name:   "model",
      options:  {
        label:  "Model",
        type:   "file",
      },
    },
  ],
  fieldsets: [],
  buttons: [
    {
      name:   "submit",
      options: {
        label:  "Create model",
        type:   "submit",
      },
    },
  ],
});

// Create a form for creating an new model.
const createProduct = new Form(container, {
  title: "Product creation",
  inputs: [
    {
      name:   "name",
      options:  {
        label:  "Name",
        type:   "text",
      },
    },
    {
      name:   "barcode",
      options:  {
        label:  "Barcode",
        type:   "number",
      },
    },
    {
      name:   "model",
      options:  {
        label:  "Model",
        type:   "select",
        options: [
          {
            value:  "model1",
            label:  "Model one",
          },
          {
            value:  "model2",
            label:  "Model two",
          },
          {
            value:  "model3",
            label:  "Model three",
          },
        ]
      },
    },
  ],
  buttons: [
    {
      name:   "submit",
      options: {
        label:  "Create model",
        type:   "submit",
      },
    },
  ],
});
