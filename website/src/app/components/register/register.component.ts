import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('entry_pass') entry_pass: ElementRef;
  pattern = "^[0-9][0-9]*$";
  message: string = '';
  sportsArr: any[] = [];
  sabhaName;
  ssData;
  formModel = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(8), Validators.pattern(this.pattern)]],
    sabha: [null, Validators.required],
    sportArr: [null],
  });


  constructor(private fb: FormBuilder,
    private serv: AuthService,
    private modalService: NgbModal,
    private captureService: NgxCaptureService
  ) { }
  sabhaOption: any[] = ['Kurla', 'Mulund', 'Badlapur', 'Ghatkopar-East', 'Asalpha', 'Thane', 'Chirag Nagar', 'Vikhroli', 'Sarovdaya']
  sportOption: any[] = [
    'Football',
    'Relay Race',
    'Tug of War',
    'Slow Cycle Race',
    '100 Meter Race',
    'Volley ball',
    'Kho-Kho',
    'Langdi',
    'Laghori',
  ];
  ngOnInit(): void {


  }
  get firstName() {
    return this.formModel.get('firstName');
  }
  get lastName() {
    return this.formModel.get('lastName');
  }
  get email() {
    return this.formModel.get('email');
  }
  get phone() {
    return this.formModel.get('phone');
  }
  get sabha() {
    return this.formModel.get('sabha');
  }
  selectSabha(val: any) {
    this.sabhaName = val;
  }
  onCheckboxChange(content, e: any) {
    if (this.sportsArr.length >= 4) {
      this.message = 'Please Select any 4 Games';
      // this.uncheckAll();
      e.target.checked = false;
      // e.preventDefault();
      this.modalService.open(content, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
      setTimeout(() => {
        this.modalService.dismissAll();
      }, 2500);
      return;
    }
    if (e.target.checked) {
      this.sportsArr.push(e.target.value);
    } else {
      const index = this.sportsArr.indexOf(e.target.value);
      if (index > -1) {
        this.sportsArr.splice(index, 1);
      }
    }
  }

  onSubmit(screenshotModal, msgModal) {
  //   this.ssData = {
  //     "name": "Yash Suresh Soni",
  //     "emailId": "yashsoni1997@gmail.com",
  //     "mobileNo": "9920571053",
  //     "sabha": "Ghatkopar-East",
  //     "sports": [
  //         "Relay Race"
  //     ],
  //     "sequence": 999,
  //     "_id": "635d6c10aa9d1a99f58b4f7d",
  //     "createdAt": "2022-10-29T18:08:16.698Z",
  //     "updatedAt": "2022-10-29T18:08:16.698Z",
  //     "__v": 0
  // }
  //     this.ssData.sslId = 'SSL' + this.pad(this.ssData.sequence, 3);
  //   this.modalService.open(screenshotModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
    if (this.formModel.invalid) {
      this.message = 'Form Invalid or Fields missing';
      this.modalService.open(msgModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
      setTimeout(() => {
        this.modalService.dismissAll();
        this.message = "";
      }, 2500);
      return
    }
    if(this.sportsArr.length <= 0) {
      this.message = 'Please select atleast one sport';
      this.modalService.open(msgModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
      setTimeout(() => {
        this.modalService.dismissAll();
        this.message = "";
      }, 2500);
      return
    }
    debugger
    const param = {
      "firstName": this.formModel.value.firstName,
      "lastName": this.formModel.value.lastName,
      "emailId": this.formModel.value.email,
      "mobileNo": this.formModel.value.phone,
      "sabha": this.sabhaName,
      "sports": this.sportsArr
    }
    console.log(this.formModel)
    console.log('params', param);
    console.log('sss', this.sportsArr);

    this.serv.addUser(param).subscribe((res: any) => {
      this.sportsArr = [];
      this.uncheckAll();
      this.ssData = res.data;
      this.ssData.sslId = 'SSL' + this.pad(this.ssData.sequence, 3);
      this.formModel.reset();
      this.modalService.open(screenshotModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });

    }, (err: any) => {
      console.log(err);
      if (err.error && err.error.message) {
        this.message = err.error.message;
      }
      else {
        this.message = 'Server Error ! Please try later'
      }
      this.modalService.open(msgModal, { scrollable: true, size: 'md', windowClass: 'customModal-xl' });
      setTimeout(() => {
        this.modalService.dismissAll();
        this.message = "";
      }, 2500);

    });

  }

  captureScreenshot() {
    this.captureService.getImage((document.getElementById('entry_pass') as HTMLElement), true)
      .pipe(
        tap(img => {
          console.log(img);
          var a = document.createElement("a"); //Create <a>
          a.href = img; //Image Base64 Goes here
          a.download = "SSL_2022_Entry_Pass_" + document.getElementById('player_ssl_id').innerHTML + '_' + document.getElementById('player_name').innerHTML + '.jpg'; //File name Here
          a.click(); //Downloaded file
        })
      ).subscribe();
  }

  pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  reset() {
    this.sportsArr = [];
    this.uncheckAll();
    this.formModel.reset();
  }
  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }
}
