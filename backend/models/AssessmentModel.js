/**
 * Assessment Model
 * Represents a health assessment data structure
 */

export class AssessmentModel {
  constructor(data) {
    this.age = data.age;
    this.gender = data.gender;
    this.height = data.height; // cm
    this.weight = data.weight; // kg
    this.bmi = data.bmi;
    this.familyHistory = data.familyHistory;
    this.smoking = data.smoking;
    this.alcoholConsumption = data.alcoholConsumption; // Low/Moderate/High
    this.exerciseFrequency = data.exerciseFrequency; // days per week
    this.bloodPressure = data.bloodPressure; // systolic/diastolic
    this.bloodSugar = data.bloodSugar; // mg/dL
    this.stressLevel = data.stressLevel; // 1-10
    this.sleepHours = data.sleepHours;
  }

  /**
   * Convert model to JSON
   */
  toJSON() {
    return {
      age: this.age,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      bmi: this.bmi,
      familyHistory: this.familyHistory,
      smoking: this.smoking,
      alcoholConsumption: this.alcoholConsumption,
      exerciseFrequency: this.exerciseFrequency,
      bloodPressure: this.bloodPressure,
      bloodSugar: this.bloodSugar,
      stressLevel: this.stressLevel,
      sleepHours: this.sleepHours
    };
  }
}

