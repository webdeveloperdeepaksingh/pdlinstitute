"use client";
import React, { useEffect, useState, useRef } from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({steps, currentStep}) => {

    const [newStep, setNewStep] = useState<any[]>([]);
    const stepRef = useRef<any[]>([]);

    const updateStep = (stepNumber: number, steps: any[]) => {
        const newSteps = [...steps];
        let count = 0;
        while(count < newSteps.length){
            if(count === stepNumber){
                newSteps[count] = {...newSteps[count], highlighted:true, selected:true, completed:true};
             }else if(count < stepNumber){
                newSteps[count] = {...newSteps[count], highlighted:false, selected:true, completed:true};
             }else{
                newSteps[count] = {...newSteps[count], highlighted:false, selected:false, completed:false};
            }
            count++;
        }
        return newSteps;
    };

    useEffect(()=>{
        const stepsState = steps.map((step, index) =>
            Object.assign(
                {},
                {
                    description:step,
                    completed:false,
                    highlighted: index === 0 ? true : false,
                    selected: index === 0 ? true : false,
                }
            )
        );
        stepRef.current = stepsState;
        const current = updateStep(currentStep -1, stepRef.current)
        setNewStep(current);
    },[steps, currentStep]);

    const displaySteps = newStep.map((step, index) => {
        return (
            <div key={index} className={index !== newStep.length - 1 ? 'flex items-center w-full' : 'flex items-center'}>
                <div className='relative flex flex-col items-center text-black'>
                    <div className={`flex items-center justify-center py-3 ${step.selected ? "bg-orange-500 text-white font-bold border border-orange-500" : ""} rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12`}>
                        {step.completed ?( <span className='text-white font-bold text-xl'>&#10003;</span>) :( index + 1)}
                    </div>
                    <div className={`absolute ${step.highlighted ? "text-black" : "text-gray-400"} top-0 text-center mt-16 w-32 text-xs font-medium uppercase`}>
                        {step.description}
                    </div>
                </div>
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.completed ? "border-orange-500" : "border-gray-300"}`}></div> 
            </div>
        )
    } 
    );
  return (
    <div className='flex justify-between items-center mx-4 p-4'>
      {displaySteps}
    </div>
  )
}

export default Stepper;
