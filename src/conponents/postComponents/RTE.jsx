import React,{memo} from 'react';
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'
import conf from '../../conf/conf';

export default memo(function RTE({name,control,label,defaultValue="",mode="light"}) {
  return (
    <div className='w-full mt-3'>
        {label && <label className={`mb-2 pl-1 block text-center text-xl font-semibold ${mode==="dark"? "text-white":"text-black"}`}>{label}</label>}

        <Controller
        name={name || 'content'}
        control={control}
        render={({field:{onChange}})=>(
            <Editor
            initialValue={defaultValue}
            apiKey={conf.tinyMCEApiKey}
            init={{
                initialValue: defaultValue,
                height: 600,
                menubar: true,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            
            }}
            onEditorChange={onChange}
            
            />
        )}
        />
    </div>
  )
})
