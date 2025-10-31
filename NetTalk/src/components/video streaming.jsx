import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [myId, setMyId] = useState("");
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // 1. Create a Peer object
    const newPeer = new Peer(); // auto-generates ID
    setPeer(newPeer);

    newPeer.on("open", (id) => {
      console.log("My Peer ID:", id);
      setMyId(id);
    });

    // 2. Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // 3. Answer incoming calls
        newPeer.on("call", (call) => {
          call.answer(localStream); // send local stream
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
      })
      .catch((err) => console.error(err));
  }, []);

  // 4. Make a call to another peer
  const callPeer = () => {
    if (peer && peerId && stream) {
      const call = peer.call(peerId, stream);
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    }
  };

  return (
    <div>
      <h2>React Peer.js Video Call</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <div>
          <h4>My Video</h4>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{ width: "300px" }}
          ></video>
          <p>My Peer ID: {myId}</p>
        </div>

        <div>
          <h4>Remote Video</h4>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: "300px" }}
          ></video>
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter peer ID to call"
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
      />
      <button onClick={callPeer}>Call</button>
    </div>
  );
};

export default VideoCall;