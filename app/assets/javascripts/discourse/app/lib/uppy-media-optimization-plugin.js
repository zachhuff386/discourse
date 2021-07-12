import { Plugin } from "@uppy/core";
import { Promise } from "rsvp";

export default class UppyMediaOptimization extends Plugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = opts.id || "uppy-media-optimization";

    // this is meaningless, can be anything
    this.type = "preprocessor";
    this.workerService = opts.workerService;
  }

  optimizeJPEG(fileIds) {
    let promises = fileIds.map((fileId) => {
      let file = this.uppy.getFile(fileId);

      this.uppy.emit("preprocess-progress", file, {
        mode: "indeterminate",
        message: "optimizing images",
      });

      return this.workerService
        .optimizeImage(file)
        .then((optimizedFile) => {
          if (!optimizedFile) {
            console.log(
              "nothing happened, possible error or other restriction"
            );
          } else {
            this.uppy.setFileState(fileId, { data: optimizedFile });
          }
        })
        .catch((err) => console.log(err));
    });

    const emitPreprocessCompleteForAll = () => {
      fileIds.forEach((fileId) => {
        const file = this.uppy.getFile(fileId);
        this.uppy.emit("preprocess-complete", file);
      });
    };

    return Promise.all(promises).then(emitPreprocessCompleteForAll);
  }

  install() {
    this.uppy.addPreProcessor(this.optimizeJPEG.bind(this));
  }

  uninstall() {
    this.uppy.removePreProcessor(this.optimizeJPEG.bind(this));
  }
}
