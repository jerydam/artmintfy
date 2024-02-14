import { useState } from 'react';
import { NFTStorage } from 'nft.storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Upload() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAxMmMyMDQxOTMxZjBCMTk5MjRFNjk4NjcxMDE0YzJjYjY4RWNGNjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNzc0NjU2NTkxMCwibmFtZSI6IkN5YmVyICJ9.AvvSAu9TIQV5uXXpWZ68c_0j0RGbNbc69aBjDzFDPIs';
  
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
      
    }

    setIsLoading(true); // Set loading state to true

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
        },
        body: formData,
      });

      if (response.ok) {
        try {
          const data = await response.json();
          const cid = data.value.cid;
          localStorage.setItem("uri", cid);
          alert('File uploaded successfully!');
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          // Handle JSON parsing error if needed
        }
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('unable to upload image')
    } finally {
      setIsLoading(false); // Set loading state to false, whether the upload succeeded or failed
    }
  };

  return (
    <div>
      <label htmlFor="upload" className="block text-sm font-medium text-gray-600">
        Upload Image
      </label>
      <input
        type="file"
        id="file"
        onChange={handleFileChange}
        className="mt-1 p-2 w-full border rounded-md"
      />
      <button
        type="button"
        onClick={handleUpload}
        className={`bg-blue-500 text-white p-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
