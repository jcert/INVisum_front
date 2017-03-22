
export class Dataset {
  fields : any = ['id', 'created_at', 'title', 'about', 'data', 'extension', 'rating', 'owner'];
  
  constructor(private input: any) {
    for(let f in this.fields) {
      this[f] = input[f];
    }
  }
}
