import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cifrado',
  templateUrl: './cifrado.component.html',
  styleUrls: ['./cifrado.component.scss']
})
export class CifradoComponent {
  public cipherFormData: any = {};
  public cipherForm: FormGroup;
  public decipherFormData: any = {};
  public decipherForm: FormGroup;
  public cipheredText: string;
  public decipheredText: string;
  public isCipher: boolean = true;

  public mostFrequents: string;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.createCipherForm();
    this.createDecipherForm();
    this.cipheredText = "";
    this.decipheredText = "";
  }

  createCipherForm() {
    this.cipherForm = this.fb.group({
      message: ['', Validators.required],
      a: ['', Validators.required],
      b: ['', Validators.required],
    });
  }

  createDecipherForm() {
    this.cipherForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  changeCipher() {
    this.isCipher = !this.isCipher;
  }

  affineCipher() {
    this.cipheredText = "";
    this.cipherFormData.message = this.cipherFormData.message.replace(/\n/g, ' ');
    let message: string = this.cipherFormData.message.toUpperCase();
    let letterMessage = message.split("");
    for (let i = 0; i < message.length; i++) {
			
			this.cipheredText += this.cipher(letterMessage[i]); 
		}
  }

  cipher(letter: string) {
    let cipheredLetter;
    let dictionary = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    let lettersDictionary = dictionary.split("");
    let specials = ".,:;!¡¡¿?()-_/'*+$%^@#";
    let specialsArray = specials.split("");
    let tilde = "ÁÉÍÓÚ";
    let tildeArray = tilde.split("");
    if (letter == " ") {
      return cipheredLetter = " ";
    }
    if (specialsArray.includes(letter)) {
      return cipheredLetter = "";
    }
    if (tildeArray.includes(letter)) {
      if (letter == "Á"){
        letter = "A";
      } 
      else if (letter == "É") {
        letter = "E";
      }
      else if (letter == "Í") {
        letter = "I";
      }
      else if (letter == "Ó") {
        letter = "O";
      }
      else if (letter == "Ú") {
        letter = "U";
      }
    }

    for (let i = 0; i < lettersDictionary.length; i++) {
      if (lettersDictionary[i] == letter) {
        let suma = (this.cipherFormData.a * i) + this.cipherFormData.b;
        let indexLetter = suma%27;

        for (let j = 0; j < lettersDictionary.length; j++) {
          if (indexLetter == j) {
            cipheredLetter = lettersDictionary[j];
          }
        }
      }
    }

    return cipheredLetter;

  }

  obtainFrecuencies() {
    let dictionary: any[] = [[0, "A", 0],[1, "B", 0],[2, "C", 0],[3, "D", 0],[4, "E", 0],[5, "F", 0],[6, "G", 0],[7, "H", 0],[8, "I", 0],[9, "J", 0],[10, "K", 0],
    [11, "L", 0],[12, "M", 0],[13, "N", 0],[14, "Ñ", 0],[15, "O", 0],[16, "P", 0],[17, "Q", 0],[18, "R", 0],[19, "S", 0],[20, "T", 0],[21, "U", 0],[22, "V", 0],
    [23, "W", 0],[24, "X", 0],[25, "Y", 0],[26, "Z", 0],];

    let message: string = this.decipherFormData.message.toUpperCase();
    let letterMessage = message.split("");
    
    for (let i = 0; i < letterMessage.length; i++) {
        for (let j = 0; j < dictionary.length; j++) {
          if (letterMessage[i] == dictionary[j][1]) {
            dictionary[j][2] = dictionary[j][2] + 1;
          }
        } 
    }

    dictionary.sort(function(a,b) {
      return b[2]-a[2]
    });

    return dictionary;
  }

  decipher() {
    this.decipheredText = "";
    let message: string = this.decipherFormData.message.toUpperCase();
    let letterMessage = message.split("");
    let dictionary = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    let lettersDictionary = dictionary.split("");
    let frequencies = this.obtainFrecuencies();

    let firstMostFrequent = this.obtainFrecuencies()[0];
    let secondMostFrequent = this.obtainFrecuencies()[1];
    let thirdMostFrequent = this.obtainFrecuencies()[2];
    let fourthMostFrequent = this.obtainFrecuencies()[3];

    

    let a = 0;
    let b = 0;
  
    b = secondMostFrequent[0]%27;
    a = ((firstMostFrequent[0] - b) * this.inverseNumber(4, 27))%27;

    let inverseA = this.inverseNumber(a, 27);
    if (inverseA == -1) {
        b = secondMostFrequent[0]%27;
        a = ((fourthMostFrequent[0] - b) * this.inverseNumber(19, 27))%27;
    }

    this.mostFrequents = "Valor de a: " + a + "\n" 
      + "Valor de b: " + b + "\n" 
      + "Primera: " + firstMostFrequent[1] + " " + firstMostFrequent[2] + " veces" + "\n" 
      + "Segunda: " + secondMostFrequent[1] + " " + secondMostFrequent[2] + " veces" + "\n" 
      + "Tercera: " + thirdMostFrequent[1] + " " + thirdMostFrequent[2] + " veces" + "\n" 
      + "Cuarta: " + fourthMostFrequent[1] + " " + fourthMostFrequent[2] + " veces";

    for (let i = 0; i < letterMessage.length; i++) {
      if (letterMessage[i] == " ") {
        this.decipheredText = this.decipheredText + " ";
      }
      else {
        for (let j = 0; j < lettersDictionary.length; j++) {
          if(letterMessage[i] == lettersDictionary[j]) {
            let indexLetter = ((((j - b)) * this.inverseNumber(a, 27)%27)+27)%27;
            this.decipheredText = this.decipheredText + lettersDictionary[indexLetter];
          }
        }
      }
    }
  }


  inverseNumber(a: number, b: number) {
    a = a % b; 
		for (let x = 1; x < b; x++) 
			if ((a * x) % b == 1) 
				return x; 
		return -1; 
  }


  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(['./login']);
    }
    ).catch(error => console.log(error));
  }
}
