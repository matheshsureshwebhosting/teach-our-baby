import Help from "../components/Help";
import Login from "../components/Auth_Pages/Login";
import Sigin from "../components/Auth_Pages/Sigin";
import Use from "../components/Use";
import Recentlyupload from '../components/Dashboard_Pages/Recentlyupload'
import Remainder from '../components/Dashboard_Pages/Remainder'
import upload from '../components/Dashboard_Pages/upload'
// import Splite from "../components/Splite";
import Priceplan from "../components/Priceplan";
import Forgotpass from "../components/Auth_Pages/Forgotpass";
import Editaccount from "../components/Auth_Pages/Editaccount";
import verificationcode from "../components/Auth_Pages/Verificationcode";
import Welcome_step1 from "../components/Welcome_page/Welcome_step1";
import Home from "../components/Home";
import Shuffledppt from "../components/Shuffledppt";
import Calendar from "../components/Calendar/Calendar";
import Recentupload from "../components/Recentupload";
import Remaniders from "../components/remaniders"
import TestWizard from "../components/Test/Wizard"
import Uploadform from "../components/Uploadform";
import home from "../components/admin/home";
import Usersdata from "../components/admin/Usersdata";
import Uploadedppts from "../components/admin/Uploadedppts"
import Shuffledpptdata from "../components/admin/Shuffledpptdata"
import Contact from "../components/contact"
import Downloadhistory from "../components/Downloadhistory";
export const Routes = [
    {
        path: "/",
        components: Login,
        exact: true
    },
    {
        path: "/signup",
        components: Sigin,
        exact: true
    },
    {
        path: "/dashboard",
        components: Home,
        exact: true
    },
    {
        path: "/contact",
        components: Contact,
        exact: true
    },
    {
        path: "/help",
        components: Help,
        exact: true
    },
    {
        path: "/use",
        components: Use,
        exact: true
    },
    {
        path: "/uploadppt",
        components: upload,
        exact: true
    },
    {
        path: "/remainder",
        components: Remainder,
        exact: true
    },
    {
        path: "/recently-uploaded",
        components: Recentlyupload,
        exact: true
    },
    {
        path: "/Priceplan",
        components: Priceplan,
        exact: true
    },
    {
        path: "/forgot",
        components: Forgotpass,
        exact: true
    },
    {
        path: "/profile/edit",
        components: Editaccount,
        exact: true
    },
    {
        path: "/verificationcode",
        components: verificationcode,
        exact: true
    },
    {
        path: "/welcome",
        components: Welcome_step1,
        exact: true
    },
    {
        path: "/home",
        components: Home,
        exact: true
    },    
    {
        path: "/upload",
        components: Uploadform,
        exact: true
    }
    ,    
    {
        path: "/shuffledppt/:id",
        components: Shuffledppt,
        exact: true
    }    
    ,    
    {
        path: "/calendar",
        components: Calendar,
        exact: true
    } ,    
    {
        path: "/recentuploads",
        components: Recentupload,
        exact: true
    } ,    
    {
        path: "/remainders/:date",
        components: Remaniders,
        exact: true
    } ,    
    {
        path: "/test/wizard",
        components: TestWizard,
        exact: true
    }  ,    
    {
        path: "/test/From",
        components: Uploadform,
        exact: true
    }   ,    
    {
        path: "/admin",
        components: home,
        exact: true
    }   ,    
    {
        path: "/admin/users",
        components: Usersdata,
        exact: true
    }  ,    
    {
        path: "/admin/uploadppts",
        components: Uploadedppts,
        exact: true
    }  ,    
    {
        path: "/admin/shuffledppts",
        components: Shuffledpptdata,
        exact: true
    },    
    {
        path: "/downloadhistory",
        components: Downloadhistory,
        exact: true
    }
]
