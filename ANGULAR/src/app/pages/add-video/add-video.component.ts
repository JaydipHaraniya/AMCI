import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { HttpClient ,Headers} from '@angular/common/http';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
declare var AWS: any;
import {
  Router, ActivatedRoute
} from '@angular/router';
import { Video } from 'video-metadata-thumbnails';
import { AppService } from '../../app.service';

import { VideoProcessingService } from '../../video-processing-service';
@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css'],
  providers: [VideoProcessingService]
})

export class AddVideoComponent implements OnInit {
  add: FormGroup;
  public postId;
  public thumbnailData: string;

  public headers: Headers
  public imageUrl;
  public isEdit = false
  public loader = false
  public _id;
  public metadata = {}
  public type: number
  public adapiData;;
  awsBucket = 'workgigbucket';
  constructor(private route: ActivatedRoute, private _AppService: AppService, private fb: FormBuilder, private videoService: VideoProcessingService, public http: Http, private router: Router,) {
    this.route.params.subscribe(params => {
      this._id = params['id'];
      this.type = (this._id) ? this._id : 1
    });
    this.add = fb.group({
      'name': ['', Validators.required],
      'discriptiom': ['', Validators.required],
      'title': ['', Validators.required],
    });


  }

  ngOnInit(): void {
    this.loader = false

    if (this.type != 1) {
      this.searchById()
    }
  }

  searchById() {
    this._AppService.searchResultById(this.type).subscribe((result) => {
      if (result) {

        this.adapiData = result
        this.imageUrl = result[0].imgeUrl
        this.add.controls['name'].setValue(result[0].name);
        this.add.controls['discriptiom'].setValue(result[0].discriptiom);
      } else {
        console.log("error..........!")
      }
    });
  }
  addData(data) {
    if (this.isEdit) {

      data.value["imgeUrl"] = this.imageUrl
      data.value["thumbnailData"] = this.thumbnailData
      data.value["metadata"] = this.metadata


      this.headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.put('http://localhost:1900/upload/' + this._id, JSON.stringify(data.value), { headers: this.headers }).subscribe({
        next: data => {
          this.router.navigate(['./']);
        },
        error: error => console.error('There was an error!', error)
      })
    } else {

      data.value["imgeUrl"] = this.imageUrl
      data.value["thumbnailData"] = this.thumbnailData
      data.value["metadata"] = this.metadata


      this.headers = new Headers({ 'Content-Type': 'application/json' });
      this.http.post('http://localhost:1900/upload', JSON.stringify(data.value), { headers: this.headers }).subscribe({
        next: data => {
          this.router.navigate(['./']);
        },
        error: error => console.error('There was an error!', error)
      })
    }

  }
  gotoedit() {
    this.isEdit = true
    this.type = 1
  }
  async uploadFile(e) {
    this.thumbnailData = "";
    this.imageUrl = ""
    this.loader = true
    var bucket = new AWS.S3({ params: { Bucket: "xyz" } });
    var fileChooser = e.srcElement;
    var file = fileChooser.files[0];
    let date = new Date();
    const video = new Video(file);
    this.metadata = await video.getMetadata()
    this.videoService.generateThumbnail(file)
      .then(thumbnailData => {
        this.thumbnailData = thumbnailData;
      })
    if (file) {
      var params = { Key: 'keymaing' + date, ContentType: file.type, Body: file };
      bucket.upload(params, (err, data) => {
        this.loader = false
        this.imageUrl = data.Location

      });
    }
    return false;
  };
}
