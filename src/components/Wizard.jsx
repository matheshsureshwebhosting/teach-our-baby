import React, { Component } from 'react';
import Form1 from './Wizard/Form1';
import Form2 from './Wizard/Form2';
import Form3 from './Wizard/Form3';
import Form4 from './Wizard/Form4';
import "./css/wizard.css";
import firebase from "../database/firebase"
import axios from 'axios';
class Wizard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1,
      category: "",
      description: "",
      file: "",
      shuffle: "",
      modalShow: false,
      newcategory: ["Color", "Fruits", "Vegetables"],  
      msg:"Please Wait...",
      submitbtn:false
    }
    this._next = this._next.bind(this)
    this._prev = this._prev.bind(this)
  }

  _next() {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 3 ? 4 : currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }

  _prev() {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1 ? 1 : currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }


  errorClass(error) {
    return (error.length === 0 ? '' : 'is-invalid')
  }


  get previousButton() {
    let currentStep = this.state.currentStep
    if (currentStep !== 1) {
      return (
        <button className="btn btn-secondary previous" type="button" onClick={this._prev}>Previous</button>
      )
    }
    return null
  }

  get nextButton() {
    let currentStep = this.state.currentStep
    if (currentStep < 4) {
      return (
        <button className="btn btn-primary float-right next" type="button" onClick={this._next}>Next</button>
      )
    }
    return null
  }
  handleChange = (event) => {
    const { name, value } = event.target
    if (name === "file") {
      this.setState({
        [name]: event.target.files[0]
      })
    } else {
      if (value === "Add") {
        this.setState({
          modalShow: true
        })
      }
      this.setState({
        [name]: value
      })
    }
  }
  handleSubmit = async () => {
    const userid = localStorage.getItem("userid")
    const { category, description, file, shuffle } = this.state
    if (shuffle > 22) {
      toast.error("Shuffle more than 22 Not Accepted.. ", {
        autoClose: 1000,
        transition: Slide
    })
    } else {
      this.setState({
        submitbtn:true
      })
      console.log(file);
      const getshuffleppturl = await this.getShuffleppturl(file, userid, shuffle)
      console.log(getshuffleppturl);      
      const pptdatas = await {
        category: category,
        description: description,        
        shuffle: Number(shuffle),
        shuffled_ppt: getshuffleppturl
      }
      console.log(pptdatas);
      await axios.post("http://168.119.159.183:4500/shuffle/send", { pptdatas }, {
        headers: {
          userid: userid
        }
      }).then(async(res) => {
        const shuffledpptid=await res.data  
        window.location.replace(`/shuffledppt/${shuffledpptid}`)
      })
    }
  }
  getShuffleppturl = async (file, userid, shuffle) => {
    const getShuffleppturl = new Promise(async (resolve, reject) => {
      const path = `${userid}/originalppts/`
      const formData = await new FormData()
      await formData.append("myFile", file)
      await formData.append("shuffle", Number(shuffle))
      await axios.post("http://168.119.159.183:4500/shuffle-ppt/uploadfile", formData, {
        headers: {
          userid: userid
        }
      }).then(async (res) => {
        console.log(res.data);
        const originalppt = await this.pptUploader(path, res.data)
        if (originalppt.length !== 0) {
          return resolve(originalppt)
        } else {
          return resolve(false)
        }
      })
    })
    return await getShuffleppturl
  }
  pptUploader = async (path, file) => {
    const pptUploader = new Promise(async (resolve, reject) => {
      const urls = []
      for (var i = 0; i < file.length; i++) {
        var storageRef = firebase.storage().ref(path + file[i].filename);    
        await storageRef.putString(file[i].file, 'data_url').then(async (snapshot) => {
         await this.setState({
            msg:`${i+1}/${file.length} Your Shuffled PPT Uploading...`
          })
          await storageRef.getDownloadURL().then(function (url) {
            urls.push(url)
          })
        });
      }
      resolve(urls)
    })
    return await pptUploader
  }
  addcat = () => {
    this.setState({
      option: true
    })
    const { newcategory, category } = this.state
    const tempcat = newcategory
    tempcat.push(category)
    this.setState({
      newcategory: tempcat
    })
    this.closemodal()
  }
  closemodal = () => {
    this.setState({
      modalShow: false
    })
  }

  render() {    
    const {msg,submitbtn}=this.state
    return (
      <React.Fragment>
       <div>
          <Form1
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            modalShow={this.state.modalShow}
            closemodal={this.closemodal}
            addcat={this.addcat}
            newcat={this.newcat}
            category={this.state.newcategory}
            selectedcat={this.state.category}
          />
          <Form2
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
          />
          <Form3
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            canSubmit={this.state.canSubmit}
          />
          <Form4
            currentStep={this.state.currentStep}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            submitbtn={submitbtn}
            msg={msg}
          />
          <div className="row container button">
            <div className="col-md-8">
              {/* <img src={welcomeimg} alt="" id="leftimg" /> */}
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-3">
              {this.previousButton}
              {this.nextButton}
            </div>
          </div>
        </div>

      </React.Fragment>
    )
  }
}

export default Wizard;