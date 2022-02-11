import { MdOutlineContentCopy, MdOutlineDelete } from "react-icons/md";
import { useEffect } from "react";
import hljs from "highlight.js";
import { toast } from "react-toastify";
import router from "next/router";
import { parseCookies } from "nookies";
function Card({ code, title, codeId, cheatsheetId }) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  function copyToClipBoard() {
    navigator.clipboard.writeText(code);
    toast(`Code Copied Successfully`, {
      position: "top-center",
      type: "success",
    });
  }

  const deleteCode = async () => {
    if (!confirm("Do you really want to delete?")) return;

    // getting cookies
    const cookies = parseCookies();

    // creating cheatsheet
    const res = await fetch(
      `http://localhost:8000/api/cheatsheet/${cheatsheetId}/codes/${codeId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const data = await res.json();

    // cheking for errors
    if (res.status === 400) {
      toast(data.error, {
        position: "top-center",
        type: "error",
      });

      return;
    }

    // deleted succesfully
    if (res.status === 200) {
      toast(`Deleted Successfully`, {
        position: "top-center",
        type: "success",
      });
      router.push(`/cheatsheet/${cheatsheetId}`);
    }
  };

  return (
    <div className="rounded-md p-5 shadow-lg light:border dark:bg-card border-gray-50 max-h-96">
      <div className="flex justify-between">
        <h3 className="font-bold mr-4">{title}</h3>
        <div className="flex relative">
          <MdOutlineContentCopy
            onClick={copyToClipBoard}
            size="24"
            className="cursor-pointer mr-5 text-primary"
          />

          <MdOutlineDelete
            onClick={deleteCode}
            size="24"
            className="cursor-pointer text-red-500"
          />
        </div>
      </div>
      <pre className="mt-4  max-h-80 overflow-scroll">
        <code>{code}</code>
      </pre>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
}

export default Card;
