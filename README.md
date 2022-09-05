# projeto18-valex

### Rota POST /create-card

Rota autenticada: A chave de API deverá ser recebida no header x-api-key  
Espera receber o seguinte objeto:  
{  
  "employeeId": 1,  
  "cardType": "transport"  
}  
OBS: Adicionei um console.log que informará o CVV para facilitar os testes.  


### Rota PUT /activate-card

Rota não autenticada.  
Espera receber o seguinte objeto:  
{  
  "cardId": 1,   
  "cardCvv": "999"   
  "password": "9999"   
}  
OBS: Essa rota apenas ativa o cartão, mas o mesmo continuará bloqueado até ser desbloqueado na rota de desbloqueio.  


### Rota PUT /block-card

Rota não autenticada.  
Espera receber o seguinte objeto:  
{  
  "cardId": 1,   
  "password": "9999"   
}  


### Rota PUT /unblock-card

Rota não autenticada.  
Espera receber o seguinte objeto:  
{  
  "cardId": 1,   
  "password": "9999"   
}  


### Rota POST /reload-card

Rota autenticada: A chave de API deverá ser recebida no header x-api-key  
Espera receber o seguinte objeto:  
{  
  "cardId": 1,   
  "reloadValue": 9999  
}  


### Rota POST /payment-pos

Rota não autenticada.  
Espera receber o seguinte objeto:  
{  
  "cardId": 1,   
  "password": "9999",  
  "businessId": 1,  
  "amount": 999  
}  


### Rota GET /card-statement

Rota não autenticada.  
Espera receber o seguinte objeto:  
{  
  "cardId": 1,   
  "password": "9999"  
}  
