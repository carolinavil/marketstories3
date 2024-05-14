import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VindiService } from '../../../services/vindi-service';
import { lastValueFrom } from 'rxjs';
import { LoginModel } from '../../../models/pagamento.module';
import { AfterViewInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css'
})
export class PainelComponent {
  loginModel = new LoginModel()
  falhaLogin = false
  cus: any
  usuarios:any
  id:number = 0
  objeto: any
  admin = false
  constructor(private vindiService: VindiService,
    private activatedRoute: ActivatedRoute,
  ) {
    lastValueFrom(this.vindiService.getClientes()).then(res => {
      // Acessando diretamente o array payment_methods
      const customers = res.customers;
      this.cus = customers
      console.log('clientes:', this.cus);
    });
    lastValueFrom(this.vindiService.getAssinaturas()).then(res => {
      // Acessando diretamente o array payment_methods
      const customers = res.subscriptions;
      this.cus = customers
      console.log('clientes:', this.cus);
    });

 
  }

  send(form: NgForm) {
    console.log(this.loginModel);

    lastValueFrom(this.vindiService.account(this.loginModel)).then((res) => {
      console.log('Resposta:', res);
    }).catch((error) => {
      if (error.status === 401) {
        console.error('Erro 401: Não autorizado');
        this.falhaLogin = true
        // Coloque aqui o que deseja fazer em caso de erro 401, como exibir uma mensagem para o usuário
      } else {
        console.error('Erro:', error);
        this.falhaLogin = false
        // this.router.navigate
      }
    });
  }



  ngAfterViewInit(): void {
    var params = this.activatedRoute.params.subscribe(x => {
      if (x['id']!=0) {
        const strNumero = x['id']; // Acessa a propriedade 'id' dentro do objeto 'x'
        const numeroInteiro = parseInt(strNumero, 10); // Converte para número inteiro
        console.log('teste', numeroInteiro); 
        console.log('params', x);
        lastValueFrom(this.vindiService.getAssinaturas())
          .then(res => {
            const customerDesejada = res.subscriptions.find((assinatura: any) => assinatura.customer.id === numeroInteiro);
            console.log('teste2', customerDesejada);
            this.objeto = customerDesejada
            console.log(this.objeto.id)
          })
          .catch(error => {
            console.log('Erro ao buscar assinaturas.', error);
          });
  
      }
      else if(x['id']==0){
        this.admin = true
       
     
      } else {
        console.log('Parâmetro id não encontrado.');
      }
    });
  }
  
  

}