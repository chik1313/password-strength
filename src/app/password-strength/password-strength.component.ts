import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() public passwordToCheck: string | undefined;
  @Output() passwordStrength = new EventEmitter<boolean>();


  bar0: string | undefined;
  bar1: string | undefined;
  bar2: string | undefined;

  private colors = ['darkred', 'orange', 'yellowgreen'];

   checkStrength(p:any) {
    // 1
    let force = 0;

    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const Letters = /[A-z]+/.test(p);
    /*const upperLetters = /[A-Z]+/.test(p);*/
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    // 3
    const flags = [Letters, numbers, symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * p.length + ((p.length >= 8) ? 1 : 0);
    force += passedMatches * 10;

    // 6
    force = (p.length <= 7) ? Math.min(force, 10) : force;

    // 7
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    /*force = (passedMatches === 4) ? Math.min(force, 40) : force;*/

    return force;
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;
    this.setBarColors(3, '#DDD');
    if (password) {
      const c = this.getColor(this.checkStrength(password));
      this.setBarColors(c.index, c.color);
      const pwdStrength = this.checkStrength(password);
      pwdStrength === 30 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);
    }
  }

  private getColor(s:any) {
    let index = 0;
    if (s === 10) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } /*else if (s === 40) {
      index = 3;
    }*/ else {
      index = 3;
    }
    return {
      index: index + 1,
      color: this.colors[index]
    };
  }

  private setBarColors(count:number, col:string) {
    for (let n = 0; n < count; n++) {
      // @ts-ignore
      this['bar' + n] = col;
    }
  }
}
