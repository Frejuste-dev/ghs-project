import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  // Validateur pour les heures de travail (max 12h)
  @ValidatorConstraint({ name: 'maxWorkHours', async: false })
  export class MaxWorkHoursConstraint implements ValidatorConstraintInterface {
    validate(endTime: string, args: ValidationArguments) {
      const startTime = (args.object as any)[args.constraints[0]];
      
      if (!startTime || !endTime) return true;
  
      const start = this.timeToMinutes(startTime);
      const end = this.timeToMinutes(endTime);
      const duration = (end - start) / 60;
  
      return duration <= 12;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'La durée de travail ne peut pas excéder 12 heures';
    }
  
    private timeToMinutes(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
  }
  
  export function MaxWorkHours(
    property: string,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'maxWorkHours',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: MaxWorkHoursConstraint,
      });
    };
  }
  
  // Validateur pour les dates futures uniquement
  @ValidatorConstraint({ name: 'isFutureDate', async: false })
  export class IsFutureDateConstraint implements ValidatorConstraintInterface {
    validate(date: any) {
      if (!date) return true;
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }
  
    defaultMessage() {
      return 'La date ne peut pas être dans le passé';
    }
  }
  
  export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isFutureDate',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsFutureDateConstraint,
      });
    };
  }
  