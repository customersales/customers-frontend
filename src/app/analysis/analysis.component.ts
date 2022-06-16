import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { AuthenticateService } from '../authenticate.service';

declare var tableau: any;

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  graph2:any;
  kmeansData:any;
  constructor(private http:HttpClient,private router:Router, private authenticate:AuthenticateService, public app: AppComponent) { }

  ngOnInit(): void {

    if(!this.authenticate.islogin){

      this.router.navigate(['authorize'])
    }

    this.scatterPlot()
  }
  scatterPlot(){
    const server = environment.server
    const auth = this.authenticate.get('currentUser')
    const body = {'user':auth}
    this.http.get<any>(server+'analysis/?type=kmeansClustering').subscribe(data=>{
      this.kmeansData = JSON.parse(data)
      console.log(this.kmeansData.usual_customers[0])
      this.graph2 = {
        data: [
          { x: this.kmeansData.usual_customers[0], y: this.kmeansData.usual_customers[1], type: 'scatter', name:'Usual Customers' ,mode:'markers',marker:{size:7}},
          { x: this.kmeansData.priority_customer[0], y:this.kmeansData.priority_customer[1] , type: 'scatter',name:'priority customer', mode:'markers',marker:{size:7}},
          { x: this.kmeansData.target_customer_young[0],y: this.kmeansData.target_customer_young[1], type: 'scatter', mode:'markers',name:'target customer young',marker:{size:7} },
        ],
        layout:{
          title:{
            text:"Kmeans Cluster",
            font:{
              family:'courier New, monospace',
              size:24,
              letter_spacing:4,
            },
            xref:'paper',
            x:0.05,
          },
          autosize: false,
          width:1400,
          height:700,
          margin: {
            l: 50,
            r: 50,
            b: 300,
            t: 100,
            pad: 4
          },
        xaxis:{
          title:'Total orders'
        },
        yaxis:{
          title:'Quantity'
        }
        }
      };
    })
  }
}
