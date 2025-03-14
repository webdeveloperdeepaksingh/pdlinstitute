"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/utils/constant";
import toast from "react-hot-toast";


interface AddNewPanProps  {
    sdkDocType: string;
    sdkDocOwnr: string;
    sdkUpldDate: Date;
    sdkDocRel: string;
    sdkIdProof: string;
    sdkIdNbr: string;
    usrId?: string;
  };

const AddNewID: React.FC = () => {

  const router = useRouter();
  const [data, setData] = useState<AddNewPanProps>({sdkDocType:'', sdkDocOwnr:'', sdkUpldDate:new Date(), sdkDocRel:'', sdkIdProof:'', sdkIdNbr:'', usrId:''});
   
  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) =>{
        return {
            ...prev, [name]: value
        }
    });     
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();      
    try 
      {
          const response = await fetch(`${BASE_API_URL}/api/documents`, {
            method: 'POST',
            body: JSON.stringify({
                sdkDocType: 'Id',
                sdkDocOwnr: data.sdkDocOwnr, 
                sdkUpldDate: new Date(), 
                sdkIdNbr: data.sdkIdNbr,
                sdkDocRel: data.sdkDocRel, 
                sdkIdProof: data.sdkIdProof,   
                // usrId: data.usrId
            }),
          });
      
          const post = await response.json();
          console.log(post);
      
          if (post.success === false) {
              toast.error(post.msg);
          } else {
              toast.success(post.msg);
              router.push('/account/doc-list/id-card');
          }
      } catch (error) {
          toast.error('Error uploading document.');
      } 
    }; 
    
  return (
    <div className="flex justify-center items-center my-8">
      <form className="formStyle w-[600px]" onSubmit={handleSubmit}>
        <div className="grid grid-rows-4 gap-2">
          <div className="flex flex-col gap-2">
              <label className='text-lg'>ID Number:</label>
              <input type='text' className='inputBox'name="sdkIdNbr" value={data.sdkIdNbr} onChange={handleChange} placeholder="Enter id number"/>
          </div>
          <div className="flex flex-col gap-2">
            <label className='text-lg'>Owner Name:</label>
            <input className='inputBox' name="sdkDocOwnr" value={data.sdkDocOwnr} placeholder="Enter the name of ID owner"  onChange={handleChange}/>
          </div> 
          <div className="flex flex-col gap-2">
              <label className='text-lg'>Relation:</label>
              <input className='inputBox' name="sdkDocRel" value={data.sdkDocRel}  onChange={handleChange}/>
          </div>
          <div className="flex flex-col gap-2">
              <label className='text-lg'>ID Image:</label>
              <div className="flex gap-1">
                  <input type='file' className='inputBox w-full' name="sdkIdProof" value={data.sdkIdProof} onChange={handleChange} />
                  <button type='button' className='btnRight'>Upload</button>
              </div>
          </div>                        
        </div>
        <div className="flex gap-2 w-full mt-3">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/doc-list/id-card")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddNewID;

