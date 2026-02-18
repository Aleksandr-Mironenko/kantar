import { NextResponse } from "next/server";
import addServices from "./add";
import delService from "./del";
import updateService from "./update";
// import { CommentServices, UpdateCommentProps } from './types';
import { uploadFilesService } from "./upload";

// type ReqBody =
//   | { type: "add"; props: CommentServices }
//   | { type: "del"; props: { id: string } }
//   | { type: "update"; props: UpdateCommentProps };

export async function POST(req: Request): Promise<Response> {

  try {
    const formData = await req.formData();
    // let uploadedFile: { id: string; file: File | null } = { id: "", file: null };
    let uploadedFile: File | null = null;

    let is_active: boolean = false;
    let is_main_component: boolean = false;
    let type: string = "";
    let name: string = "";
    let description: string = "";
    let full_description: string = "";
    let url_page: string = "";
    let url_image: string = "";
    let url_vizual_name: string = "";
    let id: string = "";
    let newName: string = "";


    for (const [key, value] of formData.entries()) {
      // const match = key.match(/^files\[(\d+)\]$/);

      // if (match && value instanceof File) {
      //   const id = match[1]

      //   uploadedFile = { id, file: value }
      //   continue;
      // }
      if (value instanceof File) {
        uploadedFile = value
      }
      if (typeof value === "string") {
        if (key === "is_active") {
          is_active = value === "true" ? true : false
        } if (key === "is_main_component") {
          is_main_component = value === "true" ? true : false
        } else if (key === "type") {
          type = value
        } else if (key === "name") {
          name = value
        } else if (key === "description") {
          description = value
        } else if (key === "full_description") {
          full_description = value
        }
        else if (key === "url_image") {
          url_image = value
        }
        else if (key === "url_page") {
          url_page = value
        } else if (key === "url_vizual_name") {
          url_vizual_name = value
        } else if (key === "id") {
          id = value
        } else if (key === "newName") {
          newName = value
        }
      }
    }


    if (type === "add") {
      // const upload = await uploadFilesService({ file: uploadedFile, serviceUrlname: url_vizual_name });
      // if (upload) {
      //   const result = await addServices({
      //     name,
      //     description,
      //     full_description,
      //     url_image: upload,
      //     url_page,
      //     is_active,
      //     url_vizual_name
      //   });
      //   return NextResponse.json(result, { status: result.success ? 200 : 400 });
      // }
      let fileUrl = ""
      fileUrl = await uploadFilesService({ file: uploadedFile, serviceUrlname: url_vizual_name });

      const result = await addServices({
        name,
        description,
        full_description,
        url_image: fileUrl,
        url_page,
        is_active,
        is_main_component,
        url_vizual_name
      });
      return NextResponse.json(result, { status: result.success ? 200 : 400 });


    }

    else if (type === "del") {
      const result = await delService(id);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    else if (type === "update") {
      // const upload = await uploadFilesService({ file: uploadedFile, serviceUrlname: url_vizual_name });
      // if (upload) {
      //   const result = await updateService({
      //     id,
      //     newName,
      //     description,
      //     full_description,
      //     url_image: upload,
      //     url_page,
      //     is_active,
      //     url_vizual_name,
      //   })

      //   return NextResponse.json(result, { status: result.success ? 200 : 400 });
      // }
      let fileUrl = url_image || "";

      if (uploadedFile) {
        fileUrl = await uploadFilesService({ file: uploadedFile, serviceUrlname: url_vizual_name });
      }
      const result = await updateService({
        id,
        newName,
        description,
        full_description,
        url_image: fileUrl,
        url_page,
        is_active,
        is_main_component,
        url_vizual_name,
      })

      return NextResponse.json(result, { status: result.success ? 200 : 400 });

    }

    return NextResponse.json(
      { success: false, error: "Invalid type" },
      { status: 400 }
    );
  }
  catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}



