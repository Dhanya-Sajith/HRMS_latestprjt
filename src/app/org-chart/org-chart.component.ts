import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ApiCallService } from '../api-call.service';
import { LoginService } from 'src/app/login.service';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnInit {

  userSession:any = this.session.getUserSession();
  empcode: any=this.userSession.empcode;
  level: any=this.userSession.level;
  authorityflg:any =this.userSession.authorityflg;
  companycode: any=this.userSession.companycode;
  ename:any=this.userSession.name;

  username: string = '';
  mainjson: any;
  listCompany: any;
  listEmployees: any;
  listcompany: any;
  employee:any = -1;
  comcode:any;
  logopath:any;
  //Orgchart:any;
  company:any;
  hostname: any;
 currdate:any;
 ecount:any;

  
  @ViewChild('Orgcharts', { static: true }) Orgcharts!: ElementRef;
  logo: any;
  htmlContent: any;
  chartUrl:any;


  constructor(private apicall:ApiCallService,private session:LoginService,private renderer: Renderer2,private http: HttpClient){}
  
  ngOnInit(): void {
    this.comcode = this.companycode
    this.employee = this.empcode
    this.hostname=this.apicall.dotnetapi;
     this.apicall.GetCurrentDate(this.comcode).subscribe((res)=>{
      this.currdate=res[0].WORK_DATE;
    //  alert(JSON.stringify(res));
      this.ecount=res[0].REQUEST_ID;
    //  alert('fdf')
    //  alert(this.currdate)
         });
    this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
      this.listCompany=res;
    //  alert(SON.stringify(this.listCompany));
      if (this.listCompany.length > 0) {
        this.comcode = this.listCompany[0].KEY_ID;
        this.company=this.listCompany[0].DATA_VALUE;
      }
      
    });
   
    this.apicall.FetchEmployeeList(-1,-1,this.employee).subscribe((res)=>{
      this.listEmployees=res;
           
    });
   //alert(this.currdate)
  // if(this.currdate!=undefined)
  this.viewChart(this.employee,this.comcode,1,0,this.currdate);
    }
    // loadHtml() {
    //   alert('fdf')
    //   this.http.get<any>('http://localhost:4200/assets/Orgchart.html').subscribe((data)=>{
    //     alert('gf')
    //     this.htmlContent = data;
    //     alert(this.htmlContent)
    //   })
    // }
        
    changeValueEmp(event:any): void {
   
     // alert(this.employee)
     let text = event.target.options[event.target.options.selectedIndex].text;
     this.ename=text;
      this.viewChart(this.employee,this.comcode,1,this.ecount,this.currdate);
      //alert(text);
    }
    viewfull(): void {
   
     //  alert(this.employee)
       
       this.viewChart(this.employee,this.comcode,0,this.ecount,this.currdate);
       }

  changeValue(event: any): void {
    let text = event.target.options[event.target.options.selectedIndex].text;
    //let selecode = event.target.options.selected;
    this.company=text;
   
    this.apicall.FetchEmployeeList(-1,this.comcode,this.empcode).subscribe((res)=>{
      this.listEmployees=res;
                 
    })
    this.apicall.GetCurrentDate(this.comcode).subscribe((res)=>{
      this.currdate=res[0].WORK_DATE;
     // alert(JSON.stringify(res));
      this.ecount=res[0].REQUEST_ID;
    //  alert(this.ecount)
      this.employee='-1';
    this.viewChart(this.employee,this.comcode,1,this.ecount,this.currdate);
           });
   
    //alert(text);

    
  }
  viewChart(ecode:any,comp:any,tp:any,ecount:any,dd:any)
  {
  try{ 
   // alert(comp)
localStorage.setItem("chrt_empcode",ecode);
localStorage.setItem("chrt_company",comp);
localStorage.setItem("chrt_ecount",ecount);
localStorage.setItem("chrt_dd",this.currdate);
localStorage.setItem("chrt_ename",this.ename);
localStorage.setItem("chrt_viewtp",tp);
localStorage.setItem('chart_api',this.apicall.dotnetapi);
//alert(ecount)
var port=window.location.port;
if(port!='')
{
  var hostname = window.location.hostname+':'+window.location.port;
}
else{
  var hostname = window.location.hostname;
}

//alert(hostname)
    this.chartUrl=new URL('http://'+hostname+'/assets/organizationChart.html');

   if(tp==1)
   {
  //  alert(this.chartUrl)
      let fl=<HTMLDivElement>document.getElementById('chartview');
    //alert(fl)
    fl.innerHTML='<object  data=' + this.chartUrl + ' width="100%" height="700" ><embed src='+ this.chartUrl +' width="100%" height="700" /></object>'
  // alert(fl.innerHTML) 
  }
   else{
    window.location.href = this.chartUrl;
   }
  }catch (error) {
    console.error('An error occurred:', error);
  }

// //this.loadExternalContent(this.chartUrl);
//   let fl=<HTMLDivElement>document.getElementById('fullchart');
// //fl.innerHTML='<p>dggfgfg</p>';
//     fl.innerHTML='<object  data=' + this.chartUrl + ' width="100%" height="700" ><embed src='+ this.chartUrl +' width="100%" height="700" /></object>'
//  //fl.innerHTML='<iframe  src=' + this.chartUrl + ' width="100%" height="700"></iframe>'
//  //this.loadExternalContent(this.chartUrl);

  }
 
  
   convertToPDF()
 {
 // this.captureAndGeneratePdf();
 // alert('gfg');
  const element: HTMLElement = <HTMLDivElement>document.getElementById('htmlElementId'); // Replace with your HTML element's ID
  //alert("fgg")
  if (element) {
    html2canvas(element,{
          useCORS: true,
          allowTaint: false,
      }).then((canvas) => {

      //alert(canvas);

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Portrait, millimeters, A4 size

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the PDF dimensions
      const imgWidth = 310; // A4 size width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF and handle scaling
     pdf.addImage(contentDataURL, 'PNG',0,0,0,0);
      // // Draw a border around the entire page
      // pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

      // Add the image inside the bordered area
     // pdf.addImage(contentDataURL, 'JPG', xPosition, yPosition, imgWidth, imgHeight);
      //pdf.addImage(contentDataURL, 'PNG', imgWidth, imgHeight);

      pdf.save('Org Chart.pdf');
      
    }).catch((error) => {
      console.error('Error during html2canvas conversion:', error);
    });
  } else {
    console.error("Element with ID 'htmlElementId' not found");
  }
}

 
}
  