"use client";
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/table/DataTable';
import Loading from '../Loading';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import Link from 'next/link';
import { MdOutlinePlaylistAdd  } from "react-icons/md";
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { HiMinus } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';

interface StudyMaterialsProps {
    matName: string, 
    matType: string, 
    matLink: string, 
    matFile: string, 
    corId: string, 
    usrId?: string
  }

const StudyMaterials : React.FC = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [matData, setMatData] = useState<StudyMaterialsProps[]>([]);
    const data = React.useMemo(() => matData ?? [], [matData]);
    const columns = React.useMemo(() => [
      { header: 'Material Name', accessorKey: 'matName',},
      { header: 'Material Type', accessorKey: 'matType',},
      { header: 'Course Name', accessorKey: 'corId',},
      { header: 'Action', accessorKey: 'matAction', 
        cell: ({ row }: { row: any }) => ( 
          <div className='flex items-center gap-3'> 
            <button type='button' title='View' onClick={()=> router.push(`/account/study-materials/${row.original._id}/view-material`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
            <button type='button' title='Edit' onClick={()=> router.push(`/account/study-materials/${row.original._id}/edit-material`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
            <button type='button' title='Disable' onClick={()=> router.push(`/account/study-materials/${row.original._id}/disable-material`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black'><HiMinus size={12}/></button>
            <button type='button' title='Delete' onClick={()=> router.push(`/account/study-materials/${row.original._id}/delete-material`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>
          </div> 
        ), 
      },
    ], []);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [filtered, setFiltered] = React.useState('');
    const [pageInput, setPageInput] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(25);

    const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
      return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
    };

    useEffect(() => {
    async function fetchMatData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/materials`, { cache: "no-store" });
        const matDataList = await res.json();
        const updatedMatList = matDataList.matList.map((item:any) => { 
          return { ...item, corId: item.corId.coName };
        });
        setMatData(updatedMatList);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }  finally {
        setIsLoading(false);
      }
    }
    fetchMatData();
    }, []); 
    
  const table = useReactTable(
    {
      data, 
      columns, 
      getCoreRowModel: getCoreRowModel(), 
      getPaginationRowModel: getPaginationRowModel(), 
      getSortedRowModel: getSortedRowModel(),
      globalFilterFn: globalFilterFn,
      state: {
        sorting: sorting,
        globalFilter: filtered,
        pagination: { pageIndex: pageInput - 1, pageSize: 25 }
      },
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setFiltered
    }
  );

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const page = e.target.value ? Number(e.target.value) - 1 : 0; 
    setPageInput(Number(e.target.value)); 
    table.setPageIndex(page); 
  };

  return (
    <div>
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <select className='inputBox w-[300px]'>--- Select Course ---</select>
          </div>
          <div className='flex gap-2 items-center'>
            <Link href="/account/add-new-material" className='btnLeft'><MdOutlinePlaylistAdd  size={24}/></Link>
            <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className='overflow-auto max-h-[412px]'>
        <DataTable  table={table}/>
      </div> 
      <div>
        <div className='flex mt-4 gap-1'>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput(1); table.setPageIndex(0); }}>{"<<"}</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput((prev) => Math.max(prev - 1, 1)); table.previousPage(); }} disabled={!table.getCanPreviousPage()}>Previous</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput((prev) => Math.min(prev + 1, table.getPageCount())); table.nextPage(); }} disabled={!table.getCanNextPage()}>Next</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput(table.getPageCount()); table.setPageIndex(table.getPageCount() - 1); }}>{">>"}</button>
        </div>
        <div className='flex mt-4 items-center justify-between'>
          <div className='flex flex-col'>
            <p className='italic'>Total Pages: &nbsp; {table.getPageCount()}</p>
            <p className='italic'>You are on page: &nbsp; {(table.options.state.pagination?.pageIndex ?? 0) + 1}</p>
          </div>
          <div className='flex gap-1 items-center'>
            <p className='italic'>Jump to page: &nbsp;</p>
            <input type='number' className='px-2 py-1 rounded-lg border-[1.5px] border-black w-[70px] inline' value={pageInput} onChange={handlePageChange} min={1} max={table.getPageCount()}/>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default StudyMaterials;
