import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { INode } from 'ngx-org-chart/lib/node';
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
  username: string = '';
  mainjson: any;
  nodes:INode[]=[];
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
  private scale: number = .80;
  private readonly scaleStep: number = 0.1;
  private readonly minScale: number = 0.5;
  private readonly maxScale: number = 1;

  @ViewChild('Orgcharts', { static: true }) Orgcharts!: ElementRef;
  logo: any;
  constructor(private apicall:ApiCallService,private session:LoginService,private renderer: Renderer2,private http: HttpClient){}

ngOnInit(): void {
  this.hostname=this.apicall.dotnetapi;
  this.apicall.FetchCompanyList(this.empcode).subscribe((res)=>{
    this.listCompany=res;
    //alert(JSON.stringify(this.listCompany));
    if (this.listCompany.length > 0) {
      this.comcode = this.listCompany[0].KEY_ID;
      this.company=this.listCompany[0].DATA_VALUE;
    }
  //  alert(this.company)
    // this.apicall.GetCompanyLogo(this.comcode).subscribe(async (res)=>{
    //   this.listcompany=res;
    //   this.logopath=res[0].DATA_VALUE;
    //   this.logo = this.hostname + this.listcompany[0].DATA_VALUE;
    //   this.logo = await this.getBase64ImageFromUrl(this.hostname + this.listcompany[0].DATA_VALUE);
    // });
    this.apicall.GetCurrentDate().subscribe(async (res)=>{
      this.currdate=res[0].FROM_DATE;
    //  alert(this.currdate)
    });
  })

  this.apicall.FetchEmployeeList(-1,-1,this.empcode).subscribe((res)=>{
    this.listEmployees=res;
         
  })

  }
customizenodes(nd:INode[],pid:any)
{ //alert("FHh")
  //alert(this.nodes.length);
  for(let nds of nd)
  {
   // alert(this.employee);
   //if((nds.ParentId=='0'|| nds.ecode=='0') && this.employee=='-1')
   //{
    nds.title=nds.title=nds.title.replace('⮟','⮝');
   //}
    if(nds.ParentId==pid)
    {//alert(this.nodes[l].name);
      nds.hidden=false;
    //nds.title='hhj';
      this.toggleCollapse(nds);
      //nds.hidden=true;
    }
    this.customizenodes(nds.childs,pid);
  }
  
}
toggleNode(node: INode): void {
  node.hidden = !node.hidden;
  //alert('fd')
}
toggleCollapse(nod:INode) {

if(nod.hidden==false)
  {
  nod.title=nod.title.replace('⮝','⮟');
 // nod.title=nod.title.replace('⮟','⮝');
let childlen=nod.childs.length;
//alert(childlen)
if(childlen>0)//ie there
 // alert(childlen)
  for(var k=childlen;k>0;)
  {
        nod.childs = nod.childs.filter(child => child.ecode !== nod.childs[k-1].ecode);
    k=nod.childs.length;
  }
 
  nod.title=nod.title.replace('⮝','⮟');
 nod.hidden=true;
 // nod.image='path_to_image';
 }
else
  { //alert('condition')
    this.apicall.GetChartData(this.employee,this.comcode).subscribe((res)=>{
      
      this.mainjson=res;
      //alert(JSON.stringify(this.mainjson));
    });
let mainchildlen=this.mainjson.length;

// alert(mainchildlen)
if(mainchildlen>0)//ie there
 {
 const node = this.searchFilter(nod.ecode,this.mainjson)
 const node1 = this.searchFilter(nod.ecode,this.nodes)
 //alert(node.childs.length)
   for(var j=0; j<node.childs.length;j++)
  {
    //alert(JSON.stringify(node.childs[j]));
    
    node1.childs.push(node.childs[j]);
    this.customizenodes(node1.childs,nod.ecode);
    //this.toggleCollapse(node1.childs);
  }
  
  nod.hidden=false;
  nod.title=nod.title.replace('⮟','⮝');
//this.nodes[0].childs = this.nodes[0].childs.filter(child => child.ecode !== nod.ecode);
}
}
}

childsearch:any;
searchFilter(search: string, directories: any[]) {
//alert(JSON.stringify(directories));
for(let directory of directories){
 // alert(JSON.stringify(directory));
    if(directory.ecode==search){
     // alert(JSON.stringify(directory));
        return directory;
    }
    if (directory.childs !== undefined && directory.childs.length > 0) {
        this.childsearch = this.searchFilter(search, directory.childs)
        if (this.childsearch !== undefined) {
            return this.childsearch
        }
    }
}
return undefined;
}
deepCloneTree(nodes: INode[]): INode[] {
return nodes.map(node => ({
  ecode:node.ecode,
        name: node.name,
        title: node.title,
        cssClass: node.cssClass,
        image:node.image,
        hidden:node.hidden,
        ParentId:node.ParentId,
        addtext:node.addtext,
        childs: node.childs ? this.deepCloneTree(node.childs) : []
}));
}
handleExpand(node: INode) {
//alert("fdf")
const element = document.getElementById(node.ecode);
if (element) {
  const chartContainer = document.getElementById('chartContainer');
  if (chartContainer) {
    chartContainer.scrollLeft += element.offsetWidth; // Adjust this value as needed
  }
}
}

viewChart()
{

  this.apicall.GetChartData(this.employee,this.comcode).subscribe((res)=>{
    this.nodes=res;
    //this.company=this.comcode;
    if(this.employee=='-1')
    {this.customizenodes(this.nodes,'MJ00022');}
     else{
    this.customizenodes(this.nodes,this.employee);
   }
  });
  //alert(this.comcode)
  this.apicall.GetCompanyLogo(this.comcode).subscribe((res)=>{
    this.listcompany=res;
    alert(JSON.stringify(res));
    this.logopath=res[0].DATA_VALUE;
    alert(this.logopath)
   let kk=(<HTMLInputElement>document.getElementById("Orgcharts")); 
   this.renderer.setStyle(kk, 'transform', `scale(${this.scale})`);
  })
 
}
changeValue(event: any): void {
  let text = event.target.options[event.target.options.selectedIndex].text;
  this.company=text;
  alert(text);
}
zoomIn() {
  let kk=(<HTMLInputElement>document.getElementById("Orgcharts")); 
  
     if (this.scale < this.maxScale) {
     this.scale += this.scaleStep;
    //alert(this.scale)
    this.renderer.setStyle(kk, 'transform', `scale(${this.scale})`);
   }
  
}
zoomOut() {
  let kk=(<HTMLInputElement>document.getElementById("Orgcharts")); 
  
  if (this.scale > this.minScale) {
    this.scale -= this.scaleStep;
    //alert(this.scale)
    this.renderer.setStyle(kk, 'transform', `scale(${this.scale})`);
  }
}
setscale()
{
  //alert(this.scale)
}
private applyScale() {
  //alert(this.Orgcharts.nativeElement);
   this.renderer.setStyle(this.Orgcharts.nativeElement, 'transform', `scale(.75)`);
}

async getBase64ImageFromUrl(imageUrl: string): Promise<string | undefined> {
  try {
    const response = await this.http.get(imageUrl, { responseType: 'blob' }).toPromise();

    if (!response) {
      console.error(`Image not found at ${imageUrl}`);
      return undefined;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to convert image to base64."));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read image file."));
      };
      reader.readAsDataURL(response);
    });
  } catch (error) {
    console.error(`Failed to fetch image from ${imageUrl}:`, error);
    return undefined;
  }
}

convertToPDF() {
  const element: HTMLElement = <HTMLDivElement>document.getElementById('htmlElementId'); // Replace with your HTML element's ID
  const logoImg = new Image();
  logoImg.src = this.hostname+this.logopath;
  if (element) {
    html2canvas(element,{
      logging: true,
      allowTaint: true,
      useCORS: true,
      }).then((canvas) => {

      //alert(canvas);

      const contentDataURL = canvas.toDataURL();
      const pdf = new jsPDF('portrait', 'mm', 'a4'); // Portrait, millimeters, A4 size

      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const xPosition = (pdf.internal.pageSize.width - imgWidth) / 2; // Center horizontally
      const yPosition = 10; // Center vertically

      // Draw a border around the entire page
      pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

      // Add the image inside the bordered area
     // pdf.addImage(contentDataURL, 'JPG', xPosition, yPosition, imgWidth, imgHeight);
      pdf.addImage(contentDataURL, '', xPosition, yPosition, imgWidth, imgHeight);

      pdf.save('Org Chart.pdf');
      
    }).catch((error) => {
      console.error('Error during html2canvas conversion:', error);
    });
  } else {
    console.error("Element with ID 'htmlElementId' not found");
  }
}

zoomIn1() {
  let kk=(<HTMLInputElement>document.getElementById("Orgcharts")); 
  
     if (this.scale < this.maxScale) {
    //alert(this.scale)
   // alert(this.maxScale)
    //alert(kk)
    this.scale += this.scaleStep;
   // alert(this.scale)
    this.renderer.setStyle(kk, 'transform', `scale(${this.scale})`);
  //   alert(this.scale)
   // this.applyScale();
  //  alert(this.username);
  }

}
zoomOut1() {
  let kk=(<HTMLInputElement>document.getElementById("Orgcharts")); 
 // alert(this.scale)
    //alert(this.minScale)
    //alert(kk)
  if (this.scale > this.minScale) {
    this.scale -= this.scaleStep;
   // alert(this.scale)
    this.renderer.setStyle(kk, 'transform', `scale(${this.scale})`);
  }
}





}


