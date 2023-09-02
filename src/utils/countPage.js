export const countPage = (req) =>{

        const noDoc = req.query.noDoc
        const size = +req.query.size;
        let noPage 
        if (!(noDoc % size)) noPage = noDoc / size
        else{
          if (noDoc < size) noPage = 1
          else {
            const x = noDoc % size
            const y = noDoc - x
            const z = (y / size) + 1
            noPage = z
          }
        }

        return noPage
    }
