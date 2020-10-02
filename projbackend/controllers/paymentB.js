var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "k6mtphmm7gchjkkg",
  publicKey: "tdkpggz364h9msyf",
  privateKey: "da834512b3f0044afaf749d8688f777f"
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({},function (err, response) {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.send(response);
        }
      });
}; 

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(error){
              res.status(500).send(error);
          }else{
              res.json(result);
          }
      });
};