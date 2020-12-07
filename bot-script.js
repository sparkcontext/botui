var botui = new BotUI('help-bot');
var res_email = '';

greetings()
  .then(function (res) {
    if (res.value === "what_can_you_do") {
      what_can_you_do()
      .then(function (res) { // will be called when a button is clicked.
        if (res.value == 'password_reset') {
          entering_email_id()
            .then(function () {
              verification_method()
                .then(function (res) {
                  if (res.value == 'phone_call') {
                    phone_call()
                      .then(function () {
                        reset_success()
                        .then(function (res) { // will be called when a button is clicked.
                          if (res.value == 'false') {
                            return goodbye();
                          } else if (res.value == 'true') {
                            return what_can_you_do();
                          }
                        });
                      })
                  }
                })
            });
        }
      });
    } else {
      goodbye();
    }
  })


  function goodbye() {
    botui.message.bot({
      delay: 500,
      content: 'Okay! Have a nice day! <i class="far fa-smile-wink"></i>'
    })
  }

  function what_can_you_do() {
    return botui.action.button({
      action: [
        {
          icon: 'search-plus',
          text: 'Trouble Shooting',
          value: 'trouble_shooting'
        },
        {
          icon: 'ticket',
          text: 'Create Ticket',
          value: 'create_ticket'
        },
        {
          icon: 'unlock-alt',
          text: 'Password Reset',
          value: 'password_reset'
        },
      ]
    }
    )
  }

  function verification_method(){
    return botui.message.add({
      type: 'html',
      delay: 500,
      loading: true,
      content: 'kindly choose your verification method'
    }).then(function (){
      return botui.action.button({
        action: [
          {
            text: 'SMS',
            value: 'sms'
          },
          {
            text: 'Phone Call',
            value: 'phone_call'
          }
        ]
      });
    })
  }

function anything_else() {
  return botui.message.add({
    type: 'html',
    delay: 500,
    loading: true,
    content: 'Is there anything else i could help with?'
  }).then(function () {
    return botui.action.button({
      action: [
        {
          text: 'Yes',
          value: 'true'
        },
        {
          text: 'No',
          value: 'false'
        }
      ]
    })
  })
}

function entering_email_id(){
  return botui.message.add({
    type: 'html',
    delay: 500,
    loading: true,
    content: 'kindly please confirm your identity by entering your email id'
  })
    .then(function () {
      return botui.action.text({
        delay: 500,
        loading: true,
        action: {
          sub_type: 'email',
          placeholder: 'someone@somesite.com'
        },
      })
    }).then(function (res_email) {
      return botui.message.add({
        type: 'html',
        delay: 500,
        loading: true,
        content: 'your email is '+res_email.value+'. Confirm?'
      })
    }).then(function (){
      return botui.action.button({
        action: [
          {
            text: 'Yes',
            value: 'true'
          },
          {
            text: 'No',
            value: 'false'
          }
        ]
      }).then(function(res){
        if(res.value == 'true'){
          email = res_email.value;
          return email
        }else if(res.value == 'false'){
          return entering_email_id();
        }
      })
    });
}

function greetings(){
  return botui.message.add({
    type: 'html',
    delay: 500,
    loading: true,
    content: 'Hello Visitor! I am IT Helpdesk <b>BOT</b>'
  })
    .then(function () {
      return botui.message.add({
        delay: 500,
        loading: true,
        content: 'To know more about how i can help <br> please click below:'
      });
    })
    .then(function (index) {
      return botui.action.button({
        action: [
          {
            text: 'What can you do?',
            value: 'what_can_you_do'
          }
        ]
      });
    })
}

function reset_success(){
  return botui.message.add({
    type: 'html',
    delay: 500,
    loading: true,
    content: 'Your password is successfully reset. <br> Your new password is @cuvate@123'
  })
  .then(function () {
  return botui.message.add({
    type: 'html',
    delay: 500,
    loading: true,
    content: 'Please change your password upon login'
  }).then(function(){
    return anything_else()
  });
});
}

function phone_call(){
  return botui.message.add({
    type: 'html',
    delay: 500,
    loading: true,
    content: 'Calling you on your registered mobile. <br> Please press \"#\" key when you are asked to verify'
  })
}