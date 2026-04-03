import "./App.css";
import Demo from "./Components/Demo";
import Hero from "./Components/Hero";

// let trustedURL;
// if (window.trustedTypes && trustedTypes.createPolicy) {
//   const policy = trustedTypes.createPolicy("myPolicy", {
//     createScriptURL: (input) => {
//       return input;
//     },
//   });
//   trustedURL = policy.createScriptURL(
//     "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"
//   );
// } else {
//   trustedURL =
//     "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js";
// }

// let jspdf = document.createElement("script");
// jspdf.onload = function () {
//   let pdf = new jsPDF();
//   let elements = document.getElementsByTagName("img");
//   for (let i = 0; i < elements.length; i++) {
//     let img = elements[i];
//     if (!/^blob:/.test(img.src)) {
//       continue;
//     }
//     let canvasElement = document.createElement("canvas");
//     let con = canvasElement.getContext("2d");
//     canvasElement.width = img.width;
//     canvasElement.height = img.height;
//     con.drawImage(img, 0, 0, img.width, img.height);
//     let imgData = canvasElement.toDataURL("image/jpeg", 1.0);
//     pdf.addImage(imgData, "JPEG", 0, 0);
//     if (i !== elements.length - 1) {
//       pdf.addPage();
//     }
//   }
//   pdf.save("download.pdf");
// };
// jspdf.src = trustedURL; 
// document.body.appendChild(jspdf);

function App() {
  return (
    <div>
      <main>
        <div>
          <div className="gradient"></div>
          <div className="app">
            <Hero />
            <Demo />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
