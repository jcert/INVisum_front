import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Item } from '../../models/item';

@Injectable()
export class FakeItems {
  items: Item[] = [];

  defaultItem: any = {
    "name": "Indice de qualidade de gestão",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut metus leo. Ut sit amet metus vulputate, posuere arcu non. ",
    "uploader": "IRB",
    "rating": 70
  };


  constructor(public http: Http) {
    let items = [
      {
        "name": "Indice de qualidade de gestão",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut metus leo. Ut sit amet metus vulputate, posuere arcu non. ",
        "uploader": "IRB",
        "rating": 90
       },
       { 
        "name": "Dados Econômico-Tributários e Aduaneiros da Receita Federal",
        "description": "Contém diversos tipos de dados relacionados às atividades da receita federal - arrecadação, fiscalização e outros",
        "uploader": "Receita Federal",
        "rating": 80
       },
       {
        "name": "Estatísticas de Comércio Exterior",
        "description": "Contém dados do Ministério da Indústria, Comércio exterior e Serviços",
        "uploader": "MDIC",
        "rating": 70
       },
       {
        "name": "Cota Parlamentar ",
        "description": "Contém dados sobre projetos legislativos que tramitam ou tramitaram na câmara dos deputados, além de dados sobre licitações",
        "uploader": "Câmara",
        "rating": 60
       },
       {
        "name": "Autoria e relatoria de matérias",
        "description": "Contém dados sobre projetos legislativos que tramitam ou tramitaram no senado, além de dados sobre licitações",
        "uploader": "Senado",
        "rating": 50
       },
       {
        "name": "Relatorio Estadual",
        "description": "Contém dados sobre o setor de comunicações",
        "uploader": "MCTI",
        "rating": 40
       },
       {
        "name": "IDA Statement of Credits and Grants",
        "description": "Contém dados econômicos e sociais",
        "uploader": "World Bank",
        "rating": 30
       },
       {
        "name": "Avaliação de filmes",
        "description": "Contém dados sobre pontuação de filmes",
        "uploader": "Movielens",
        "rating": 20
       }
     ];

     for(let item of items) {
       this.items.push(new Item(item));
     }
  }

  query(params?: any) {
    if(!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for(let key in params) {
        let field = item[key];
        if(typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if(field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
  
}
