import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wheel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.css'],
})
export class WheelComponent {
  targetNumber: number | null = null;
  rotation: number = 0;
  isSpinning: boolean = false;
  result: number | null = null;
  errorMessage: string | null = null; // 👈 added
  sectors: Array<{
    number: number;
    path: string;
    color: string;
    textX: number;
    textY: number;
    textRotate: number;
  }> = [];

  constructor() {
    this.generateSectors();
  }

  generateSectors() {
    const color1 = '#15af44';
    const color2 = '#211f1f';

    const centerX = 200;
    const centerY = 200;
    const radius = 190;
    const anglePerSector = 360 / 10;

    for (let i = 0; i < 10; i++) {
      const startAngle = i * anglePerSector - 90;
      const endAngle = (i + 1) * anglePerSector - 90;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      const textAngle = startAngle + anglePerSector / 2;
      const textRad = (textAngle * Math.PI) / 180;
      const textRadius = 130;
      const textX = centerX + textRadius * Math.cos(textRad);
      const textY = centerY + textRadius * Math.sin(textRad);
      const textRotate = textAngle + 90;

      this.sectors.push({
        number: i + 1,
        path,
        color: i % 2 === 0 ? color1 : color2,
        textX,
        textY,
        textRotate,
      });
    }
  }

  spin() {
    // always allow click, but handle invalid case
    if (this.isSpinning) return;

    // invalid number case
    if (
      this.targetNumber === null ||
      this.targetNumber < 1 ||
      this.targetNumber > 10
    ) {
      this.errorMessage = 'Please enter a valid number between 1 and 10!';
      setTimeout(() => (this.errorMessage = null), 3000); // hide after 3s
      return;
    }

    // valid number → spin
    this.isSpinning = true;
    this.result = null;

    const targetAngle = (this.targetNumber - 1) * 36 + 18;
    const currentRotation = this.rotation % 360;
    const totalSpins = 2;
    const newRotation =
      this.rotation + totalSpins * 360 + (360 - targetAngle) - currentRotation;

    this.rotation = newRotation;

    setTimeout(() => {
      this.isSpinning = false;
      this.result = this.targetNumber;
    }, 4000);
  }
}
