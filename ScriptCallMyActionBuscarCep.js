function BuscaCEP(primaryControl)
{
    var globalContext = Utility.globalContext();

    var formContext = primaryControl;

    var cep = formContext.getControl("address1_postalcode:").getAttribute().getValue();

    console.log("address1_postalcode:" + cep)

    if(cep)
    {
        cep = cep.replace(/\D/g,"");
        var parameters = {
            "CepInput":cep
        };

        var req = new XMLHttpRequest();
        req .open("POST", globalContext.getClientUri() + "/api/data/v9.2/dio_ActionCep", true);
        req .setRequestHeader("Accept", "application/json");
        req .setRequestHeader("cotent-Type", "application/json; charset=utf-8");
        req .setRequestHeader("OData.MaxVersion", "4.0");
        req .setRequestHeader("OData.Version", "4.0");

        req .onreadystatechange = function()
        {
            if(this.readyState == 4)
            {
                req.onreadystatechange = null;
                if(this.status == 200 || this.status == 204)
                {
                    Xrm.Utility.alertDialog("Action executada com sucesso..!");
                    var result = JSON.parse(this.response);
                    const jsonCEP = JSON.parse(result.ResultadoCEP);
                    console.log(jsonCEP);
                    formContext.getAttribute("address1_line1").setValue(jsonCEP.logradouro);
                    formContext.getAttribute("address1_line2").setValue(jsonCEP.bairro);
                    formContext.getAttribute("address1_city").setValue(jsonCEP.localidade);
                    formContext.getAttribute("address1_stateorprovince").setValue(jsonCEP.uf);
                }
                else
                {
                    var error = JSON.parse(this.response).error;
                    Xrm.Utility.alertDialog("Error in Action:" + error.message);
                }
            }
        };

        req.send(JSON.stringify(parameters));
    }
  
}